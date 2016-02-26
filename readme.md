[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/gmontalvoriv/quickee-app?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Overview (for the current iteration)

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

**See [server.js](https://github.com/gmontalvoriv/bb-backend/blob/master/server.js) for available routes**

- Some of these are optional routes that I created for future development options

## Authentication

User validation and endpoint protection is done using the JSON Web Token authentication methods.

## Changes (everything is subject to change)

> Update this document if any changes that do not comply with these methods are made.

## Available endpoints

#### Main route

```GET /api```

#### User registration
  
```POST /api/register```

#### User login

```POST /api/login```

#### Get a user's information

```GET /users/:username```

#### Update user information

```PUT /users/:userid```

#### Delete a user

```DELETE /users/:userid```

#### Update a user's location

```PUT /users/location/userid```

#### Get a user's profile information

```GET /users/profile/username```

#### Update a user's profile information
```PUT /users/profile/username```
