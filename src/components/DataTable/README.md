# DataTable

Use this component to render a table and populate it with data from a GraphQL API.
An example of usage is the API Credentials page.

## Simple DataTable

```jsx
import { DataTable } from "./toolkit";

/* GraphQL query used to load table data */
const GET_DATA = gql`
  query getData($merchantId: String!) {
    getData {
      value1
      value2
    }
  }
`;

/* 
  Function that maps data returned from query 
  into a format that can be used by the DataTable.
  For more info on `head` and `body` properties see 
  https://s3.int.klarna.net/meta/mp-ui/master/?path=/docs/components-table--simple-table (mp-ui documentation)
*/
function mapQueryToTableRows(data) {
  const head = {
    colum1: "First column",
    column2: "Second column"
  };
  const body = [
    {
      column1: {
        type: TableBodyCellType.text,
        text: data.value1
      },
      column2: {
        type: TableBodyCellType.text,
        text: data.value2
      }
    }
  ];
  return {
    head,
    body
  };
}

<DataTable
  queryGetItems={GET_DATA}
  queryVariables={{ merchantId: "K0001" }}
  emptyTableText="No data to show here"
  mapQueryToTableRows={mapQueryToTableRows}
/>;
```

![Simple Data Table](https://user-images.githubusercontent.com/16339834/105199294-eac7e180-5b3e-11eb-9c43-1ae66e644cc6.png)

## DataTable with Add button

```jsx
import { DataTable } from "./toolkit";
import * as yup from "yup";

const GET_DATA = gql`
  query getData($merchantId: String!) {
    getData {
      value1
      value2
    }
  }
`;

/* GraphQL mutation to add a new data item */
const ADD_ITEM = gql`
  mutation AddItem($merchantId: String!) {
    addItem(input: { merchantId: $merchantId }) {
      id
    }
  }
`;

function mapQueryToTableRows(data) {
  const head = {
    colum1: "First column",
    column2: "Second column"
  };
  const body = [
    {
      column1: {
        type: TableBodyCellType.text,
        text: data.value1
      },
      column2: {
        type: TableBodyCellType.text,
        text: data.value2
      }
    }
  ];
  return {
    head,
    body,
    /* 
      Data to run against validation schema before 
      performing the mutation to add a new item to the table 
    */
    validationData: {
      maxItems: body.length
    }
  };
}

<DataTable
  queryGetItems={GET_DATA}
  queryVariables={{ merchantId: "K0001" }}
  emptyTableText="No data to show here"
  mapQueryToTableRows={mapQueryToTableRows}
  addRow={{
    buttonText: "AddItem",
    mutation: ADD_ITEM,
    variables: { merchantId: "K0001" },
    /*
      Yup schema to validate against
    */
    validationSchema: yup.object().shape({
      maxItems: yup.number().max(5, "Validation error message")
    })
  }}
/>;
```

![DataTable with Add button](https://user-images.githubusercontent.com/16339834/105200980-a50c1880-5b40-11eb-9eab-c9fe5863fe9b.png)

## DataTable with row action

```jsx
import { DataTable } from "./toolkit";
import * as yup from "yup";

const GET_DATA = gql`
  query getData($merchantId: String!) {
    getData {
      value1
      value2
    }
  }
`;

function mapQueryToTableRows(data) {
  const head = {
    colum1: "First column",
    column2: "Second column"
  };
  const body = [
    {
      column1: {
        type: TableBodyCellType.text,
        text: data.value1
      },
      column2: {
        type: TableBodyCellType.text,
        text: data.value2
      },
      /*
        Control whether the action should be visible for this row
      */
      rowActionParams: {
        show: true,
        /*
          Variables can also be passed here in case 
          they're needed for the action
        */
        variables: {}
      }
    }
  ];
  return {
    head,
    body,
    /* 
      Data to run against validation schema before 
      performing the mutation to add a new item to the table 
    */
    validationData: {
      maxItems: body.length
    }
  };
}

function handleRowAction() {
  /* 
    Action to be performed. Ideally a GraphQL mutation.
  */
}

<DataTable
  queryGetItems={GET_DATA}
  queryVariables={{ merchantId: "K0001" }}
  emptyTableText="No data to show here"
  mapQueryToTableRows={mapQueryToTableRows}
  rowAction={{
    label: "Action",
    action: handleRowAction
  }}
/>;
```

![DataTable with row action](https://user-images.githubusercontent.com/16339834/105202097-e650f800-5b41-11eb-9ce2-978ef0b9ac9a.png)
