export type Credential = {
  id: string
  createdAt: string
  username: string
}

export type QueryResult = {
  getCredentials: Credential[]
}

export type DeleteCredentialVariables = {
  id: string
}