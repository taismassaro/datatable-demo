# Settings Toolkit

The Settings Toolkit is a set of components intended for building settings' pages in Merchant Portal. These components should make it easy for all teams to implement high-quality, maintainable settings without huge engineering efforts.

Layout components will help you give a unified look and feel in your settings pages with no effort.

Forms can be easily built using the toolkit wrappers provided here, and you can use all the field components from the support library `formik-fields`.

---

- [Layout Components](#layout-components)
  - [Section](#section)
- [Form Components](#form-components)
  - [SimpleForm](#simpleform)
  - [DataTable](#datatable)
- [Hooks](#hooks)
  - [useAllowedMids](#useallowedmids)
  - [useSelectedMid](#useselectedmid)

---

## Layout Components

Every page can be structured in sections, using the layout components offered in the toolkit. Every section should have one or more forms, or some read-only data.

### Section

Use this component to structure your settings pages.
Most pages in Settings app should contain one or more sections.

Example:

```jsx
import { Section, SimpleForm } from './toolkit'

<Section
  title="Welcome to settings toolkit"
  description="This will make it easier to build and maintain your settings"
>
  <SimpleForm {...}>
</Section>

```

---

## Form Components

We use [Formik](https://formik.org/docs/overview) to manage the state of our forms, which means that each field is identified by a name and automatically hooked up to validation, error-reporting and data fetching. We provide field components that can be used with formik, these are thin wrappers around bubble-ui components so the bubble-ui documentation still applies. For validation we use [yup](https://github.com/jquense/yup) validation schemas.

On top of this, we added an abstraction for dataloading and form submissions. The settings backend uses graphql, so you will have to add one graphql query for loading the initial data, and one graphql mutation for submitting your form.

The result of your graphql query can be transformed with `mapQueryToFormik`. You should return an object where each key is a fieldname and the value is your initial field value (nesting is possible).
![data fetching with mapQueryToFormik](./mapQueryToFormik.png)

In case of the mutation you have to pass a function that gets your formik state as an input (`mapFormikToMutationInput`) and maps it into mutation variables. This makes it possible to transform your form state during submit.
![form submission with mapFormikToMutationInput](./mapFormikToMutationInput.png)

### SimpleForm

Use this component to create a regular form with a save-button.

Example:
(This will render a form with a single field. On initialization, it will execute the query `GET_DATA` and display whatever value it returns in the field with name `TestField`. Then we can change the field and submit the form. Upon submit, we execute the mutation `SUBMIT_FORM` with the value of `TestField` passed as a variable.)

```jsx
import { SimpleForm, Field } from "./toolkit";

/* graphql query that is used to load initial data */
const GET_DATA = gql`
  query getData($merchantId: String!) {
    getData {
      value
    }
  }
`;

/* graphql mutation that is executed on submit */
const SUBMIT_FORM = gql`
  mutation ExampleMutation($value: string!) {
    ExampleMutation(value: $value) {
      id
    }
  }
`;
/* gets query result as input, should return formik state */
function mapQueryToFormik(data) {
  return {
    TestField: data.getData.value
  };
}

/* gets formik state as input, should return variables for mutation that is used on submit */
function mapFormikToMutationInput(state) {
  return {
    value: state.TestField
  };
}

/* a yup schema, will we validated against your formik state */
const validationSchema = yup.object().shape({
  TestField: yup()
    .string()
    .required()
});

return (
  <SimpleForm
    query={GET_DATA}
    mapQueryToFormik={mapQueryToFormik}
    queryVariables={{ merchantId: "K0001" }}
    validationSchema={validationSchema}
    mutation={SUBMIT_MUTATION}
    mapFormikToMutationInput={mapFormikToMutationInput}
  >
    <Field name="TestField" />
  </SimpleForm>
);
```

### DataTable

Please refer to [DataTable documentation](./DataTable/README.md)

---

## Hooks

### useAllowedMids

Returns all the MIDs the current user has `settings-fe` access for, according to their Merchant Portal token.

### useSelectedMid

Returns the current selected option in the MID selector, or the first MID in the allowed MIDs list.
