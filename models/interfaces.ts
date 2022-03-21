export interface MongoDBUser {
   _id?: Object,
   firstName: string,
   lastName: string,
   username: string,
   password: string,
   createdAt?: Date,
   updatedAt?: Date,
   __v?: number
}

export interface GoogleRegisterFields {
   firstName: string,
   lastName: string,
   tokenID: string,
   profilePicURL: string,
   email: string,
   save: Function
}

export interface LocallyRegisterFields {
   firstName: string,
   lastName: string,
   username: string,
   password: string,
   save: Function
}