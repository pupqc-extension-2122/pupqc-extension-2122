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
      <td>{BASE_URL}/p/proposals</td>
      <td>Project proposals page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/create-proposal</td>
      <td>Create project proposal page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/proposals/{project_id}</td>
      <td>View project proposal details page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/proposals/{project_id}/activities</td>
      <td>List of activities of project proposal page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/edit-proposal/{project_id}</td>
      <td>Edit project proposal page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/monitoring</td>
      <td>Project monitoring page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/monitoring/{project_id}</td>
      <td>View project details for monitoring page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/monitoring/{project_id}/activities</td>
      <td>List of activities for project monitoring page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/evaluation</td>
      <td>Project Evaluation page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/evaluation/{project_id}</td>
      <td>View project details for evaluation page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/p/evaluation/{project_id}/activities</td>
      <td>List of activities for project evaluation page</td>
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
      <td>List of Cooperating Agencies/Partners page</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/m/partners/{partner_id}</td>
      <td>Partner Details</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/m/memo</td>
      <td>List of MOA/MOU</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/m/reports</td>
      <td>Reports</td>
      <td>
        <ul>
          <li>Extenstionist</li>
          <li>Chief</li>
        </ul>
      </td>
    </tr>
    <!-- Admin -->
    <tr>
      <td colspan="3"><b>System Admin</b></td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/a/dashboard</td>
      <td>Dashboard - Admin page<br> Redirect if "{BASE_URL}/a"</td>
      <td>
        <ul>
          <li>Admin</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/a/users</td>
      <td>Users page</td>
      <td>
        <ul>
          <li>Admin</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/a/budget-item-categories</td>
      <td>Budget Item Categories page</td>
      <td>
        <ul>
          <li>Admin</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/a/branches-campuses</td>
      <td>Branches/Campuses page</td>
      <td>
        <ul>
          <li>Admin</li>
        </ul>
      </td>
    </tr>
    <tr style="vertical-align: top;">
      <td>{BASE_URL}/a/post-evaluation</td>
      <td>Post Evaluation page</td>
      <td>
        <ul>
          <li>Admin</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>