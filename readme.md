## Contents

- [Current build status](#current-build-status)
- [Active development server platforms](#active-development-server-platforms)
- [Building](#building)
- [Database](#database)
  - [Models](#models)
  - [Geospatial Indexes and Queries](geospatial-indexes-and-queries)
- [API reference](#api-reference)
  - [HTTP Status codes](#http-status-codes)
  - [Endpoints](#endpoints)
    - [Main route](#main-route)
    - [Registration](#registration)
    - [Login](#login)
    - [Get user information](#get-user-information)
    - [Update user information](#update-user-information)
    - [Delete a user](#delete-a-user)
    - [Update user location](#update-user-location)
    - [Update user location and return nearby users](#update-user-location-and-return-nearby-users)
    - [Get user profile information](#get-user-profile-information)
    - [Update user profile information](#update-user-profile-information)
- [Security](#security)

## Current build status

| build config | branch  | status |
| ------------ | ------- | -------|
| Linux        | master  | [![Build Status](https://travis-ci.com/gmontalvoriv/bb-backend.svg?token=hxR91szxm19yyULsAnMM&branch=master)](https://travis-ci.com/gmontalvoriv/bb-backend) |
| Linux        | dev    | [![Build Status](https://travis-ci.com/gmontalvoriv/bb-backend.svg?token=hxR91szxm19yyULsAnMM&branch=dev)](https://travis-ci.com/gmontalvoriv/bb-backend) |

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

#### Running environments

Production mode:

> This will start the server in production mode using pm2

```
$ npm start
```

Development mode:

> This will start the server in development mode using nodemon

```
$ npm run dev
```

## Database

This project is currently using a document-based database served at [mLab (DaaS)](https://mlab.com/)

| provider | host | port | database name |
| -------- | ---- | ---- | ------------- |
| mLab     | ds061355.mlab.com | 61355 | quickee-db |

### Models

**User model**

```javascript
{
  _id: ObjectID,
  createdAt: Date,
  updatedAt: Date,
  username: String, //=> unique = true, required = true
  password: String, //=> required = true
  email: String, //=> unique = true, required = true
  loc: {
    lng: Number,
    lat: Number
  },
  profile: {
    profile_image: String,
    gender: String,
    bio: String
  }
}
```
***User properties definition table***:

| Property | Description                     |
| -------- | ------------------------------- |
| _id      |  The user's ObjectId            |
| createdAt|  User creation date             |
| updatedAt|  User modification date         |
| username |  The user's username            |
| password |  The user's password            |
| email    |  The user's email               |
| loc      |  The user's location coordinates|
| profile  |  The user's profile             |
| profile_image | The user's profile image   |
| gender   | The user's gender               |
| bio      | The user's bio                  |

### Geospatial Indexes and Queries

> #### Location Data

Location data is stored as [legacy coordinate pairs](https://docs.mongodb.org/manual/reference/glossary/#term-legacy-coordinate-pairs).

This means that a user's location is stored as an array containing a set of coordinates to query from using the `$near` and `$maxDistance` MongoDB operators.

**Note**: Any response to the client that contains a user's coordinates will be modified and sent as an Object.

## API reference

### HTTP Status Codes

| Code | Description |
| ---- | ----------- |
| `200`| Standard response for successful HTTP requests. |
| `201`| The request has been fulfilled, resulting in the creation of a new resource. |
| `400`| The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing). |
| `403`| The request was a valid request, but the server is refusing to respond to it. 403 error semantically means "unauthorized", i.e. the user does not have the necessary permissions for the resource. |
| `404`| The requested resource could not be found but may be available in the future. |

### Endpoints

#### Main route

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api`  | `GET`     | `none`         |


#### Registration
  
| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/register`  | `POST`     | `none`         |

***Success Response***

 - **Code**: `201`

  - **Content**: [UserObject]

***Error Response***

 - **Code**: `400`

  - **Content**:

    ```javascript
    {
        message: 'User validation failed, a user with that username or email address already exists'
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

#### Login

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/login`  | `POST`     | `none`         |

***Success Response***

 - **Code**: `200`

  - **Content**:

    ```javascript
    {
      token: [token],
      user: [UserObject]
    }
    ```

***Error Response***

 - **Code**: `400`

  - **Content**:

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

- **Code**: `403`

  - **Content**:

    ```javascript
    {
      message: 'No token provided'
    }
    ```
    ```javascript
    {
      message: 'Failed to authenticate token'
    }
    ```

#### Get user information

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:username`  | `GET`     | `username=[String]`         |

***Success Response***

 - **Code**: `200`

  - **Content**: [UserObject]

***Error Response***

 - **Code**: `404`

  - **Content**:

    ```javascript
    {
      message: 'User doesn\'t exist'
    }
    ```

#### Update user information

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:userid`  | `PUT`     | `userid=[ObjectID]`         |

***Success Response***

 - **Code**: `200`

  - **Content**:

    ```javascript
    {
      message: 'User information updated'
    }
    ```

***Error Response***

 - **Code**: `400`

   - **Content**:

     ```javascript
     {
       message: 'Invalid user id'
     }
     ```
     ```javascript
     {
       message: 'User validation failed'
     }
     ```
 - **Code**: `404`

   - **Content**:
    
     ```javascript
      {
        message: 'User doesn\'t exist'
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

#### Delete a user

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:userid`  | `DELETE`     | `userid=[ObjectID]`         |

***Success Response***

 - **Code**: `200`

  - **Content**:

    ```javascript
    {
      message: 'User deleted'
    }
    ```

***Error Response***

 - **Code**: `400`

  - **Content**:

    ```javascript
    {
      message: 'Invalid user id'
    }
    ```

 - **Code**: `404`

   - **Content**:

     ```javascript
     { 
       message: 'User doesn\'t exist'
     }
     ```

#### Update user location

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:userid/location`  | `POST`     | `userid=[ObjectID]`         |

***Success Response***

 - **Code**: `200`

  - **Content**:

    ```javascript
    {
      message: 'User location updated'
    }
    ```

***Error Response***

 - **Code**: `400`

   - **Content**:

     ```javascript
     {
       message: 'Invalid user id'
     }
     ```
     ```javascript
     {
       message: 'User validation failed'
     }
     ```
    
 - **Code**: `404`

   - **Content**:

     ```javascript
     {
       message: 'User doesn\'t exist'
     }
     ```

**Payload example:**

```javascript
{
  "lng": "22.123456",
  "lat": "-22.123456"
}
```

#### Update user location and return nearby users

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:userid/location`  | `PUT`     | `userid=[ObjectID]`         |

***Success Response***

 - **Code**: `200`

   - **Content**: [NearbyUsers]

***Error Response***

 - **Code**: `400`

  - **Content**:

    ```javascript
    {
      message: 'Invalid user id'
    }
    ```
    ```javascript
    {
      message: 'User validation failed'
    }
    ```
    
- **Code**: `404`

  - **Content**:

    ```javascript
    {
      message: 'User doesn\'t exist'
    }
    ```

**Payload example:**

```javascript
{
  "lng": "22.123456",
  "lat": "-22.123456"
}
```

#### Get user profile information

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:username/profile`  | `GET`     | `username=[String]`         |

***Success Response***

 - **Code**: `200`

  - **Content**: [UserProfile]

***Error Response***

 - **Code**: `404`

   - **Content**:

     ```javascript
     {
       message: 'User doesn\'t exist'
     }
     ```

#### Update user profile information

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:username/profile`  | `PUT`     | `username=[String]`         |

***Success Response***

 - **Code**: `200`

  - **Content**:

    ```javascript
    {
      message: 'User profile updated'
    }
    ```

***Error Response***

 - **Code**: `404`

  - **Content**:

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

## Security

***User credentials are encrypted using the [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) algorithm and validated using [JSON Web Token](https://jwt.io/).***
