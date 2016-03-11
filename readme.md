[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/gmontalvoriv/quickee-app?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build Status](https://travis-ci.com/gmontalvoriv/bb-backend.svg?token=hxR91szxm19yyULsAnMM&branch=master)](https://travis-ci.com/gmontalvoriv/bb-backend)

## User model

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
