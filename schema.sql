//// ------------------------------------------------------
//// THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
//// ------------------------------------------------------

Project "pires" {
  database_type: 'MySql'
  Note: ''
}

Table User {
  id String [pk]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  email String [unique, not null]
  name String [not null]
  image String [not null]
  gender Gender [not null]
  birth DateTime [not null]
  addressId String [not null]
  address String [not null]
  postcode String [not null]
  latitude Float [not null]
  longitude Float [not null]
  instagramId String
  introduce String [not null]
  agreementDate DateTime [not null]
  marketingPushDate DateTime
  marketingEmailDate DateTime
  pets Pet [not null]
  chatRooms ChatRoom [not null]
  chats Chat [not null]
}

Table Pet {
  id Int [pk, increment]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  name String [not null]
  image String [not null]
  type PetType [not null]
  species String [not null]
  character String [not null]
  gender Gender [not null]
  birth DateTime [not null]
  weight Float [not null]
  neutered Boolean [not null]
  vaccinated Boolean [not null]
  user User [not null]
  userId String [not null]
}

Table Location {
  id Int [pk, increment]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  name String [not null]
  phone String [not null]
  category LocationCategory [not null]
  x Float [not null]
  y Float [not null]
  postCode String [not null]
  roadAddress String [not null]
  jibunAddress String [not null]
  images LocationImage [not null]
}

Table LocationImage {
  id Int [pk, increment]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  url String [not null]
  location Location
  locationId Int
}

Table ChatRoom {
  id Int [pk, increment]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  users User [not null]
  chats Chat [not null]
}

Table Chat {
  id Int [pk, increment]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  message String
  image String
  user User [not null]
  chatRoom ChatRoom [not null]
  userId String [not null]
  chatRoomId Int [not null]
}

Table ChatRoomToUser {
  chatroomsId Int [ref: > ChatRoom.id]
  usersId String [ref: > User.id]
}

Enum Gender {
  male
  female
}

Enum PetType {
  cat
  dog
}

Enum LocationCategory {
  hostpital
  salon
  store
}

Ref: Pet.userId > User.id

Ref: LocationImage.locationId > Location.id

Ref: Chat.userId > User.id

Ref: Chat.chatRoomId > ChatRoom.id