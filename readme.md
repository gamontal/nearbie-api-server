## Contents

- [Current build status](#current-build-status)
- [Active development server platforms](#active-development-server-platforms)
- [Building](#building)
- [Documentation](#documentation)
- [Database](#database)
- [Database models](#database-models)
- [API reference](#api-reference)

## Current build status

| build config | branch  | status |
| ------------ | ------- | -------|
| Linux        | master  | [![Build Status](https://travis-ci.com/gmontalvoriv/bb-backend.svg?token=hxR91szxm19yyULsAnMM&branch=master)](https://travis-ci.com/gmontalvoriv/bb-backend) |

### Active development server platforms

> Stable version: https://quickee-api.herokuapp.com/api

> Latest version: http://qserv-binarybeats.rhcloud.com/api

## Building

Clone this repo:

```
$ git clone git@github.com:{username}/bb-backend.git
...
$ cd bb-backend
```

#### Install dependencies and run tests

If you have `make` installed:

```
$ make install && make test
```

Otherwise:

```
$ npm install && npm test
```

***Note***: Run tests before you make any commit.

## Documentation

### Database

This project is currently using a document-based database served at [mLab (DaaS)](https://mlab.com/)

| provider | host | port | database name |
| -------- | ---- | ---- | ------------- |
| mLab     | ds061355.mlab.com | 61355 | quickee-db |

### Database Models

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
## API reference

### Main route

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api`  | `GET`     | `none`         |


### User registration
  
| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/register`  | `POST`     | `none`         |

***Success Response***

 - Code: `201`

 - Content: [User Object]

***Error Response***

 - Code: `400`

 - Content:

```javascript
{
  message: 'Validation failed, a user with that username or email address already exists.'
}
```

**Payload example:**

```javascript
{
  "username": "user1",
  "password": "1234",
  "email": "user1@gmail.com"
}
```

### User login

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/login`  | `POST`     | `none`         |

***Success Response***

 - Code: `200`

 - Content:

```javascript
{
  token: [token],
  user: [UserObject]
}
```

***Error Response***

 - Code: `403`, `400`

 - Content:

```javascript
{
  message: 'Invalid username'
}
```
```javascript
{
  message: 'Invalid password'
}

```

### Get a user's information

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:username`  | `GET`     | `username=[String]`         |

***Success Response***

 - Code: `200`

 - Content: [UserObject]

***Error Response***

 - Code: `404`

 - Content:

```javascript
{
  message: 'User doesn\'t exist'
}
```

### Update user information

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:userid`  | `PUT`     | `userid=[ObjectID]`         |

***Success Response***

 - Code: `200`

 - Content:

```javascript
{
  message: 'User information updated'
}
```

***Error Response***

 - Code: `404`, `400`

 - Content:

```javascript
{
  message: 'Invalid user id'
}
```

```javascript
{
  message: 'User doesn\'t exist'
}
```

```javascript
{
  message: 'User validation failed'
}
```

**Payload example:**

```javascript
{
  "username": "newUsername",
  "password": "newPassword",
  "email": "newEmail"
}
```

### Delete a user

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:userid`  | `DELETE`     | `userid=[ObjectID]`         |

***Success Response***

 - Code: `200`

 - Content:

```javascript
{
  message: 'User deleted'
}
```

***Error Response***

 - Code: `404`, `400`

 - Content:

```javascript
{
  message: 'Invalid user id'
}
```

```javascript
{
  message: 'User doesn\'t exist'
}
```

### Update a user's location and return nearby users

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:userid/location`  | `PUT`     | `userid=[ObjectID]`         |

***Success Response***

 - Code: `200`

 - Content: [NearbyUsers]

***Error Response***

 - Code: `404`, `400`

 - Content:

```javascript
{
  message: 'Invalid user id'
}
```

```javascript
{
  message: 'User doesn\'t exist'
}
```

```javascript
{
  message: 'User validation failed'
}
```

**Payload example:**

```javascript
{
  "lng": "22.123456",
  "lat": "-22.123456"
}
```

### Update a user's location

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:userid/location`  | `POST`     | `userid=[ObjectID]`         |

***Success Response***

 - Code: `200`

 - Content:

```javascript
{
  message: 'User location updated'
}
```

***Error Response***

 - Code: `404`, `400`

 - Content:

```javascript
{
  message: 'Invalid user id'
}
```

```javascript
{
  message: 'User doesn\'t exist'
}
```

```javascript
{
  message: 'User validation failed'
}
```

**Payload example:**

```javascript
{
  "lng": "22.123456",
  "lat": "-22.123456"
}
```

### Get a user's profile information

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:username/profile`  | `GET`     | `username=[String]`         |

***Success Response***

 - Code: `200`

 - Content: [UserProfile]

***Error Response***

 - Code: `404`

 - Content:

```javascript
{
  message: 'User doesn\'t exist'
}
```

### Update a user's profile information

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:username/profile`  | `PUT`     | `username=[String]`         |

***Success Response***

 - Code: `200`

 - Content:

```javascript
{
  message: 'User profile updated'
}
```

***Error Response***

 - Code: `404`

 - Content:

```javascript
{
  message: 'User doesn\'t exist'
}
```

**Payload example:**

```javascript
{
  "profile_image": "example.link.com",
  "gender": "Female",
  "bio": "new bio information"
}
```
