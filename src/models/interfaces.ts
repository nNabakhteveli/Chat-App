export interface MongoDBUser {
   _id?: Object,
   username: String,
   password: String,
   createdAt: Date,
   updatedAt: Date,
   __v?: number
}

export interface GoogleRegisterFields {
   firstName: String,
   lastName: String,
   tokenID: String,
   profilePicURL: String,
   email: String,
   save: Function
}

export interface LocallyRegisterFields {
   firstName: String,
   lastName: String,
   username: String,
   password: String,
   save: Function
}