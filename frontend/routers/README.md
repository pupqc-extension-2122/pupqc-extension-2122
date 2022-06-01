# Routers


## Folder Structure

```
routers
├── module_1.js
├── module_2.js
├── ...
└── module_n.js
```


## Web Routes

(Tentative)

<table style="width: 100%">
  <thead>
    <th>URL</th>
    <th>Page</th>
    <th>Authorized Roles</th>
  </thead>
  <tbody>
    <!-- Public -->
    <tr>
      <td colspan="3"><b>Public</b></td>
    </tr>
    <tr>
      <td>{BASE_URL}/login</td>
      <td>Login page</td>
      <td>
        <ul>
          <li>Public</li>
        </ul>
      </td>
    </tr>
    <!-- Monitoring -->
    <tr>
      <td colspan="3"><b>Monitoring (Module)</b></td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/dashboard</td>
      <td>Dashboard - Monitoring page<br> Redirect if "{BASE_URL}/p"</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/add-project</td>
      <td>Project proposal page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/project-proposals</td>
      <td>Add project proposal page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/project-proposals/{project_id}</td>
      <td>View project proposal details page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/project-proposals/{project_id}/edit</td>
      <td>Edit project proposal page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/project-monitoring</td>
      <td>Project monitoring page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/project-monitoring/{project_id}</td>
      <td>View project details for monitoring page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/project-evaluation</td>
      <td>Project Evaluation page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/project-evaluation/{project_id}</td>
      <td>View project details for evaluation page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/reports</td>
      <td>Reports page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <!-- MOA/MOU -->
    <tr>
      <td colspan="3"><b>MOA/MOU (Module)</b></td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/m/dashboard</td>
      <td>Dashboard - MOA/MOU page<br> Redirect if "{BASE_URL}/m"</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/m/partners</td>
      <td>List of Cooperating Agencies/Partners page"</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>