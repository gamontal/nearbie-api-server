## Index

- [Current build status](#current-build-status)
- [Active development server platforms](#active-development-server-platforms)
- [Building](#building)
- [Database](#database)
  - [Models](#models)
  - [Geospatial Indexes and Queries](#geospatial-indexes-and-queries)
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
    - [Update user profile information](#update-user-profile-information)
    - [Block a user](#block-a-user)
    - [Unblock a user](#unblock-a-user)
    - [Get nearby places](#get-nearby-places)
    - [Get place information](#get-place-information)
    - [Get events](#get-events)
    - [Get event information](#get-event-information)

- [Security](#security)
  - [Authentication](#authentication)
    - [Client Authentication](#client-authentication)
    - [User Authentication](#user-authentication)
  - [Storing Sensitive User Data](#storing-sensitive-user-data)

## Current build status

| build config | branch  | status |
| ------------ | ------- | -------|
| Linux        | master  | [![Build Status](https://travis-ci.org/gmontalvoriv/bb-backend.svg?branch=master)](https://travis-ci.org/gmontalvoriv/bb-backend) |
| Linux        | dev    | [![Build Status](https://travis-ci.org/gmontalvoriv/bb-backend.svg?branch=dev)](https://travis-ci.org/gmontalvoriv/bb-backend) |

### Active development server platforms

> Stable version: NOT AVAILABLE

> Latest version: ![](https://qserv-binarybeats.rhcloud.com/api)

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
  active: Boolean,
  createdAt: Date,
  updatedAt: Date,
  username: String,
  password: String,
  email: String,
  loc: {
    lng: Number,
    lat: Number
  },
  loc_attr: {
    zipcode: String
  },
  profile: {
    profile_image: String,
    gender: String,
    status: String
  },
  blocked_users: Array
}
```
***User properties definition table***:

| Property | Description                     |
| -------- | ------------------------------- |
| _id      |  The user's ObjectId            |
| active   |  User state flag (idle check)   |
| createdAt|  User creation date             |
| updatedAt|  User modification date         |
| username |  The user's username            |
| password |  The user's password            |
| email    |  The user's email               |
| loc      |  The user's location coordinates|
| loc_attr |  Additional location information|
| zipcode  |  The user's location zip-code   |
| profile  |  The user's profile             |
| profile_image | The user's profile image   |
| gender   | The user's gender               |
| status   | The user's bio                  |
| blocked_users    |  The user's blocked list (this array contains the ID's of the blocked users|

**Nearby places model**

```javascript
{
  _id: ObjectID,
  createdAt: Date,
  updatedAt: Date,
  place_name: String,
  place_image: String,
  place_loc: Array,
  zipcode: String
}
```

***Places properties definition table***:

| Property    | Description                     |
| --------    | ------------------------------- |
| _id         |  The place ObjectId             |
| createdAt   |  Object creation date           |
| updatedAt   |  Object update date             |
| place_name  |  The place name                 |
| place_image |  The place image                |
| place_loc   |  The place location             |
| zipcode     |  The place zipcode              |


**Events model**

```javascript
{
  _id: ObjectID,
  createdAt: Date,
  updatedAt: Date,
  event_name: String,
  event_image: String,
  start_day: Date,
  finish_day: Date,
  event_loc: Array,
  zipcode: String,
  user_count: Number
}
```

***Events properties definition table***:

| Property    | Description                     |
| --------    | ------------------------------- |
| _id         |  The event's ObjectId           |
| createdAt   |  Object creation date           |
| updatedAt   |  Object update date             |
| event_name  |  The event's name               |
| event_image |  The event's image              |
| start_day   |  The event's start date         |
| finish_day  |  The event's finish date        |
| event_loc   |  The event's location           |
| zipcode     |  The event's zipcode            |
| user_count  |  The event's nearby users count |


### Geospatial Indexes and Queries

> #### Location Data

Location data is stored as [legacy coordinate pairs](https://docs.mongodb.org/manual/reference/glossary/#term-legacy-coordinate-pairs).

This means that a user's location is stored as an array containing a set of coordinates to query from using the `$geoNear` and `$maxDistance` MongoDB operators pipelined in an `aggregation` query.

**Note**: Any response to the client that contains a user's coordinates will be modified and sent as an Object.

## API reference

### HTTP Status Codes

| Code                | Description |
| ------------------- | ----------- |
| `200 (OK)`          | Standard response for successful HTTP requests. |
| `201 (CREATED)`     | The request has been fulfilled, resulting in the creation of a new resource. |
| `400 (BAD_REQUEST)` | The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing). |
| `403 (FORBIDDEN)`   | The request was a valid request, but the server is refusing to respond to it. 403 error semantically means "unauthorized", i.e. the user does not have the necessary permissions for the resource. |
| `404 (NOT_FOUND)`   | The requested resource could not be found but may be available in the future. |

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
  "email": "user1@gmail.com",
  "loc": {
    "lng": -22.123456,
    "lat": 18.123456
  }
}
```

#### Login

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/authenticate`  | `POST`     | `none`         |

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
    
**Payload example:**

```javascript
{
  "username": "user1",
  "password": "1234"
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
| `/api/users/:user_id`  | `PUT`     | `userid=[ObjectID]`         |

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

***User Active/Inactive event payload example***

```javascript
{
  "active": false
}
```

#### Delete a user

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:user_id`  | `DELETE`     | `userid=[ObjectID]`         |

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
| `/api/users/:user_id/location`  | `POST`     | `userid=[ObjectID]`         |

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
  "lng": 22.123456,
  "lat": -22.123456
}
```

#### Update user location and return nearby users

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:user_id/location`  | `PUT`     | `userid=[ObjectID]`         |

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
  "lng": 22.123456,
  "lat": -22.123456
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
  "status": "new bio information"
}
```

#### Block a user

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:user_id/blocks/blocked_user="{blocked_user_id}"`  | `POST`     | `userid=[String]`, `blocked_user_id=[String]`     |

***Success Response***

 - **Code**: `200`

  - **Content**:

    ```javascript
    {
      message: 'New blocked user added'
    }
    ```
    
    ```javascript
    {
      message: 'User already blocked'
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
 
#### Unblock a user

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/:user_id/blocks/blocked_users=["{blocked_user_id}", ...]`  | `DELETE`     | `user_id=[String]`, `blocked_users_ids=[Array]`     |

***Success Response***

 - **Code**: `200`

  - **Content**:

    ```javascript
    {
      message: 'Removed blocked users'
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
 
#### Get nearby places

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/places/user_id]`  | `PUT`     | `user_id=[String]`

***Success Response***

 - **Code**: `200`

  - **Content**: [NearbyPlaces]

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
  "lng": 22.123456,
  "lat": -22.123456
}
```

#### Get place information

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/places/place_id]`  | `GET`     | `place_id=[String]`

***Success Response***

 - **Code**: `200`

  - **Content**: [PlaceObject]

***Error Response***

 - **Code**: `400`

  - **Content**:

    ```javascript
    {
      message: 'Invalid place id'
    }
    ```
    
- **Code**: `404`

  - **Content**:

    ```javascript
    {
      message: 'Place not found'
    }
    ```

#### Get events

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/users/events`  | `GET`     | `none`

***Success Response***

 - **Code**: `200`

  - **Content**: [EventsArray]

#### Get event information

| URL | Method | URL Params |
| --- | ------ | ---------- |
| `/api/events/:event_id`  | `GET`     | `event_id=[String]`

***Success Response***

 - **Code**: `200`

  - **Content**: [EventObject]

***Error Response***

 - **Code**: `400`

  - **Content**:

    ```javascript
    {
      message: 'Invalid event id'
    }
    ```
    
- **Code**: `404`

  - **Content**:

    ```javascript
    {
      message: 'Event not found'
    }
    ```


## Security

### Authentication

>  Client and user authentication is handled separately. What this allows you to do is treat authentication of the client as one process and then authenticating the user (checking to see if an account exists etc) so that there are two layers of security.

#### Client Authentication

> [TODO]

#### User Authentication

> User authentication is done using [JSON Web Token](https://jwt.io/). Once the user is logged in, each subsequent request will include the JWT, allowing the user to access routes, services, and resources that are permitted with that token.

**Protected routes**

 - [Login](#login)
 - [Get user information](#get-user-information)
 - [Update user information](#update-user-information)
 - [Delete a user](#delete-a-user)
 - [Update user location](#update-user-location)
 - [Update user location and return nearby users](#update-user-location-and-return-nearby-users)
 - [Update user profile information](#update-user-profile-information)
 - [Block a user](#block-a-user)
 - [Unblock a user](#unblock-a-user)
 - [Get nearby places](#get-nearby-places)
 - [Get place information](#get-place-information)
 - [Get events](#get-events)
 - [Get event information](#get-event-information)

**Token passing**

Authorization header to send the token to the server: `x-access-token`

**Authentication error response**

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

### Storing Sensitive User Data

User credentials are encryped using the [bcrypt algorithm](https://en.wikipedia.org/wiki/Bcrypt) and compared against a fixed password hash that is stored in the database after a user is created or any user related changes are made (changing the password).
