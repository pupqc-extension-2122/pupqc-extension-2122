# Routers


## Folder Structure

```
routers
├── api
│   ├── module_1.js
│   ├── module_2.js
│   ├── ...
│   └── module_n.js
├── web
│   ├── module_1.js
│   ├── module_2.js
│   ├── ...
│   └── module_n.js
└── readme.md
```


## Web Routes

(Tentative)

* Public
    - `{BASE_URL}/login`

* Extensionist
    - `{BASE_URL}/dashboard` -  Dashboard page
    - `{BASE_URL}/project-proposals` - Project proposal page
    - `{BASE_URL}/project-monitoring` - Project monitoring page
    - `{BASE_URL}/project-evaluation` - Project evaluation page
    - `{BASE_URL}/add-project` - Add project proposal page
    - `{BASE_URL}/project-proposals/{project_id}` - View project proposal details page

* Chief
    - `{BASE_URL}/dashboard` -  Dashboard page
    - `{BASE_URL}/project-proposals` - Project proposal page
    - `{BASE_URL}/project-monitoring` - Project monitoring page
    - `{BASE_URL}/project-evaluation` - Project evaluation page

* App Admin
    - Soon