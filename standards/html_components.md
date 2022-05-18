# Standardizations and Naming Conventions for HTML element and component attributes

Author: PrensDev


## General

* The `id` attribute will be used as element identifiers, so it must be UNIQUE for every page
* Always use `camelCases` and underscores for `id` attributes, `snake_cases` for `name` attributes
* You can remove `aria` attributes (just for now)
* Do not bother if names are too long


## Forms

### Standards

* All form groups must have `label`
* All labels must have `for` attribute that is linked to the id of the input (see example below)
* All inputs must have the following attributes
    - `type`
    - `id`
    - `name`
    - `placeholder`

### Format for naming attribute values

* Form id: `addWhat_form` or `createWhat_form`, `updateWhat_form` 
    - e.g. `id="addProject_form"`, `id="updateProject_form"`
    - Do not use `edit` keyword like `editProject_form`. Always use `update`
* Input id: `formId_fieldName`
    - e.g. `id="addProject_projectTitle"`
* Input name: `field_name`
    - e.g. `name="project_title"`
* For radio, checkboxes id: `formId_fieldName_specificDetails`
    - e.g. `id="addUserForm_gender_male"`, `id="addUserForm_gender_female"`

### Example

```html
<!-- Form element -->
<form id="addProject_form">

    <div class="form-group">
        <label for="addProject_title">Project Title</label>

        <!-- Input element -->
        <input 
            type="text"
            class="form-control" 
            id="addProject_title" 
            name="title" 
            placeholder="Insert the project title here"
        />
    </div>
</form>
```


## Data containers

Mostly used for containers of data for user view

### Standards

### Formats

* Parent container id: `whatContent_container`
    - e.g. `projectDetails_card`, `approvedProjects_infoCard`
* Data content id: `what_contentField`
    - e.g. `projectDetails_projectTitle` - make ot short but descriptive

### Example

```html
<!-- Parent Container -->
<div class="..." id="projectDetails_card">
    
    <!-- Child/Data Containers -->
    <div class="..." id="projectDetails_title">Project EPMS</div>
    <div class="..." id="projectDetails_startDate">July 1, 2022</div>
    <div class="..." id="projectDetails_startDateHumanized">in a few months</div>
    ...
    <div class="..." id="projectDetails_totalAmount">$50,000.00</div>
</div>
```


## DataTables

### Standards

* All DataTables must have `id` attribute
* The `table` element must contain the `thead` and `tbody` elements as its children
* The `thead` element must contain the `th` elements as its children

### Format

* Table id: `whatTable_dt`
    - e.g. `projectProposals_dt` - make sure in plural form since it is a list

### Example

```html
<!-- Data Table -->
<table class="table" id="projectProposals_dt">
    
    <!-- Head -->
    <thead>
        <th>Heading 1</th>
        <th>Heading 2</th>
        ...
        <th>Heading n</th>
    </thead>

    <!-- Body -->
    <tbody>
        
        <!-- For DataTables, this must be empty or a loading component -->

    </tbody>

</table>
```


## Modals

### Standards

* The standards for forms and data containers inside the modal are same with stated above

### Format

* Parent id: `what_modal`
    - e.g. `logout_modal`, `addProject_modal`, `confirmRemoveItem_modal`

### Example

```html
<div class="modal" id="confirmRemoveItem_modal">
    ...
</div>
```
