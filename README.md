# mini-wp
mini-wp

#User route
 Routes | Method | Request Body | Response Data | Response Error | Description 
 -------|--------|--------------|---------------|----------------|-------------|
 `/user/register` | POST | `{firstName, lastName, email, password}` | `{_id: ,firstName: , lastName: , email: , password}` | 422 (validation error), 500 (internal srver error)| add user data into database
 `/user/login` | POST | `{email, password}` | `{token, user}` | 422 (validation error), 500 (internal srver error)  | log in and get the access token


#Article route
 Routes | Method | Request Body | Response Data | Response Error | Description |
 -------|--------|--------------|---------------|----------------|-------------|
 `/api/articles` | GET | - | `{_id: ,title: , content: , image: , author}` | 404 (Not Found), 500 (internal srver error)| get the articles
 `/api/articles` | POST | `{title: , content: , image:}` | `{_id: ,title: , content: , image: , author}` | 401 (Do not have access), 500 (internal srver error)| add an article into the app
 `/api/articles/:articleId` | Patch | `{title: , content: , image: }` | - | 401 (Do not have access), 404 (Not Found), 500 (internal srver error)| update an article
 `/api/articles/:articleId` | Delete | - | - | 401 (Do not have access), 404 (Not Found), 500 (internal srver error)| delete an article