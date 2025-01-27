# visage-testing
Simple Express + React SPA for managing movies list

# Instructions to run:

database: Open terminal > docker run --name postgres-container -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=my_database -e POSTGRES_USER=my_user -p 5433:5432 -d postgres
                        
                        > cd visage-testing && psql -h http://localhost:5433 -U my_user -d my:database -a -f ./backend/resources/db_schema.sql
                        
frontend: Open terminal > cd frontend > "npm dev"

backend: Open terminal > cd backend > "npm dev"

App is now runnning on http://localhost:5173/, backend is running on localhost:3000, vite is configured to proxy requests

# About project

Libraries used:
  - Express
  - React
  - material-ui
  - cookie-parser
  - bcrypt
  - jsonwebtoken
  - axios
  - await-to-js
  - ...

Frontend auth architecture: 

Auth uses 2 tokens: access token and refresh token
*refresh token* is stored as httpOnly cookie, a random guid stored in backend database.
*access token* is jwt token stored only in transient storage (component closure), short lived, not accessible outside AuthProvider component (inner state)

On axios there is interceptor, once 401 response is received on any request auth context automatically tries to generate new access token ("/api/auth/refresh")

Components outside AuthContextProvider have access to auth-related stuff throught use of useAuthContext hook that exposes:
 - logout: () -> void -- calls POST '/api/auth/logout' in order to remove refresh token cookie, on success deletes token, useEffect cleanup function removes axios interceptor for adding Authorization header
 - login: async (username, password) -> void -- logs user in, fetches token
 - isLoggedIn: boolean
 - username: string

Having this setup achieves:
 - mitigates CSRF vulnerabilities
 - minimizes potential damage through XSS exploit
 - enables account deactivation (refresh token can be invalidated)

Backend:
 2 custom middleware components:
   - authProvider: parses jwt, sets res.auth = {userId}
   - paginationProvider: takes querry params page and limit, sets res.pagination = {page, limit}

Passwords are stored as bcrypt hashes with salt.

For postgres integration postgres-js lib is used, it uses params in background so no SQL injection should be easily achievable.


Deploying to prod:

3 containers: nginx, postgres, backend
2 volumes: postgres data, nginx static files

nginx should be configured to:
  - route /api* to localhost:3000,
  - all other routes to serve static files from volume where frontend build has been put


