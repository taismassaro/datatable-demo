# DataTable

Reusable React component with GraphQL superpowers 💪🏼

- [The problem](#the-problem)
- [The solution](#the-solution)
- [Examples](#examples)
- [To be improved](#to-be-improved)

## The problem

The team I was working in at the time had just inherited an application containing several pages that looked and behaved pretty similar: all of them had a table to list data from an API, most had a button to add new items to the table and/or a button to perform an action (like deleting or disabling) on each row. Because each page had been implemented individually, we faced a lot of code duplication and unnecessary complexity to keep these pages consistent.

## The solution

We solved the duplication problem by creating a modular reusable DataTable component that could be composed to recreate each of the existing pages. It can be used to simply list the data, and it can render buttons to perform actions on the table based on the provided props. It also supports validation for adding new items, using a [yup](https://github.com/jquense/yup) schema.

As part of our efforts to improve consistency and maintainability for this application, we created a backend-for-frontend service to use GraphQL and unify how the data could be fetched and mutated. This allowed us to abstract the API logic from the pages and make the component handle the fetching of data and adding new items based on GraphQL queries and mutations that can be passed as props.

## Examples

You can find examples of implementation of the different modules in the [examples](./src/examples/) folder.

For the purpose of these demos, I've created a mocked GraphQL [schema](./src/api/schema.ts) to generate and manipulate dummy data.

To check these out in the browser, run `yarn && yarn dev` after cloning this repository. The demo app will be available on [http://localhost:3000/](http://localhost:3000/)

## To be improved

This was the first time I wrote a truly reusable React component of this complexity and although it has been through a few iterations since it was created, there are still a few things to be improved:

- [ ] **Make it responsive**: it was created for a web desktop application so there wasn't much focus on responsiveness, but it would be great to make it more universal.
- [ ] **Improve accessibility**: unfortunately I haven't paid much attention to accessibility either, and it would be a good opportunity to learn some best practices to incorporate in my workflow.
- [ ] **Refactor into compound components**: the current implementation is pretty complex as everything is controlled via props passed to the parent DataTable component. I think it could improve readability to separate the `AddRow` and the `RowAction` modules into child components with a shared state.
- [ ] **Styling**: the original implementation used an internal UI library for styling, which I had to remove and replaced with regular HTML elements and some basic CSS. Maybe creating CSS variables or themes so that the design can be adjusted by the consumer?
