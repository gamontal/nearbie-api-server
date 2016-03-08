[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/gmontalvoriv/quickee-app?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Database and User model

Using a MongoDB database and the Mongoose library to query user information from the NodeJS server.

#### User model

```javascript
{
  _id: ObjectID,
  username: String, //=> unique = true, required = true
  password: String, //=> required = true
  email: String, //=> unique = true, required = true
  loc: [Number],
  profile: {
    profile_image: String,
    gender: String,
    bio: String
  }
}
```

## Authentication

User validation and endpoint protection is done using the JSON Web Token authentication methods.

## Changes (everything is subject to change)

> Update this document if any changes that do not comply with these methods are made.

## Available endpoints

#### Main route

```GET /api```

#### User registration
  
```POST /api/register```

**Payload example:**

```javascript
{
  "username": "user1",
  "password": "1234",
  "email": "user1@gmail.com"
}
```

#### User login

```POST /api/login```

#### Get a user's information

```GET /users/:username```


#### Update user information

```PUT /users/:userid```

**Payload example:**

```javascript
{
  "username": "newUsername",
  "password": "newPassword",
  "email": "newEmail"
}
```

#### Delete a user

```DELETE /users/:userid```

#### Update a user's location and return nearby users

```PUT /users/:userid/location```

**Payload example:**

```javascript
{
  "lng": "22.123456",
  "lat": "-22.123456"
}
```

#### Update a user's location

```POST /users/:userid/location```

**Payload example:**

```javascript
{
  "lng": "22.123456",
  "lat": "-22.123456"
}
```

#### Get a user's profile information

```GET /users/:username/profile```

#### Update a user's profile information
```PUT /users/:username/profile```

**Payload example:**

```javascript
{
  "profile_image": "example.link.com",
  "gender": "Female",
  "bio": "new bio information"
}
```
