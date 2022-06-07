/**
 * ==============================================
 * * PROJECT MONITORING
 * ==============================================
 */

 'use strict';

 const ProjectMonitoring = (() => {
 
   /**
   * * Local Variables
   */
 
   let initialized = 0;
 
   // ! Simulation
   let data;
 
   /**
   * * Private Methods
   */
 
   const initDataTable = async () => {
     await new Promise((resolve, reject) => {
       setTimeout(() => {
         
         // Sample Data
         data = [
           {
             id: 1,
             title: 'Strengthening Resilience To Disasters and Be a Solution to Changing Environment',
             implementer: 'Polytechnic University of the Philippines, Quezon City Branch',
             start_date: '05/03/2022',
             end_date: '05/04/2022',
             status: 'For evaluation',
             target_groups: [
               {
                 id: 1,
                 name: 'Staffs of Grain Foundation for PWDs Inc.'
               }, {
                 id: 2,
                 name: 'Staffs of Grain Foundation for PWDs Inc.'
               },
             ]
           }, {
             id: 1,
             title: 'Strengthening Resilience To Disasters and Be a Solution to Changing Environment',
             implementer: 'Polytechnic University of the Philippines, Quezon City Branch',
             start_date: '05/03/2022',
             end_date: '05/04/2022',
             status: 'For evaluation',
             target_groups: [
               {
                 id: 1,
                 name: 'Staffs of Grain Foundation for PWDs Inc.'
               }, {
                 id: 2,
                 name: 'Staffs of Grain Foundation for PWDs Inc.'
               },
             ]
           }, {
             id: 1,
             title: 'Strengthening Resilience To Disasters and Be a Solution to Changing Environment',
             implementer: 'Polytechnic University of the Philippines, Quezon City Branch',
             start_date: '05/03/2022',
             end_date: '05/04/2022',
             status: 'Canceled',
             target_groups: [
               {
                 id: 1,
                 name: 'Staffs of Grain Foundation for PWDs Inc.'
               }, {
                 id: 2,
                 name: 'Staffs of Grain Foundation for PWDs Inc.'
               },
             ]
           }, {
             id: 1,
             title: 'Strengthening Resilience To Disasters and Be a Solution to Changing Environment',
             implementer: 'Polytechnic University of the Philippines, Quezon City Branch',
             start_date: '05/03/2022',
             end_date: '05/04/2022',
             status: 'Pending',
             target_groups: [
               {
                 id: 1,
                 name: 'Staffs of Grain Foundation for PWDs Inc.'
               }, {
                 id: 2,
                 name: 'Staffs of Grain Foundation for PWDs Inc.'
               },
             ]
           }, {
             id: 1,
             title: 'Strengthening Resilience To Disasters and Be a Solution to Changing Environment',
             implementer: 'Polytechnic University of the Philippines, Quezon City Branch',
             start_date: '05/03/2022',
             end_date: '05/04/2022',
             status: 'Pending',
             target_groups: [
               {
                 id: 1,
                 name: 'Staffs of Grain Foundation for PWDs Inc.'
               }, {
                 id: 2,
                 name: 'Staffs of Grain Foundation for PWDs Inc.'
               },
             ]
           }, {
             id: 1,
             title: 'Strengthening Resilience To Disasters and Be a Solution to Changing Environment',
             implementer: 'Polytechnic University of the Philippines, Quezon City Branch',
             start_date: '05/03/2022',
             end_date: '05/04/2022',
             status: 'Canceled',
             target_groups: [
               {
                 id: 1,
                 name: 'Staffs of Grain Foundation for PWDs Inc.'
               }, {
                 id: 2,
                 name: 'Staffs of Grain Foundation for PWDs Inc.'
               },
             ]
           }
         ];
         resolve();
       }, 2500);
     });
 
     // Data Table
     dt = $('#projectMonitoring_dt').DataTable({
       data: data,
       responsive: true,
       language: DT_LANGUAGE,
       columns: [
         {
           data: 'title'
         }, {
           data: null,
           render: ({ target_groups }) => {
             if(target_groups.length > 1) {
               return `
                 <div>${ target_groups[0].name }</div> 
                 <div class="small">and ${ target_groups.length - 1 } more.</div>
               `
             } else if(target_groups.length === 1) {
               return target_groups[0].name;
             } else {
               return `<div class="font-italic text-muted">No target groups have been set.</div>`
             }
           }
         }, {
           data: null,
           render: ({ start_date }) => {
             return formatDateTime(start_date, 'Date');
           }
         }, {
           data: null,
           render: ({ end_date }) => {
             return formatDateTime(end_date, 'Date');
           }
         }, {
           data: null,
           render: ({ status }) => {
             const { theme, icon } = PROJECT_STATUS_STYLES[status];
             return `
               <div class="text-center">
                 <div class="badge badge-subtle-${ theme } px-2 py-1">
                   <i class="${ icon } fa-fw mr-1"></i>
                   <span>${ status }</span>
                 </div>
               </div>
             `;
           }
         }, {
           data: null,
           render: data => {
             return `
               <div class="dropdown text-center">
                 <div class="btn btn-sm btn-negative" data-toggle="dropdown" data-dt-btn="options" title="Options">
                   <i class="fas fa-ellipsis-h"></i>
                 </div>
                 <div class="dropdown-menu dropdown-menu-right">
                   <div class="dropdown-header">Options</div>
                   <a 
                     class="dropdown-item"
                     href="./view-project-monitoring.html" 
                   >
                     <span>View details</span>
                   </a>
                   <a 
                     class="dropdown-item"A
                     href="./view-project-monitoring.html" 
                   >
                     <span>Manage activities</span>
                   </a>
                 </div>
               </div>
             `;
           }
         }
       ]
     });
   }
 
   /**
   * * Public Methods
   */
 
   /**
   * * Init
   */
 
   const init = () => {
     if (!initialized) {
       initialized = 1;
       initDataTable();
     }
   }
 
   /**
   * * Return public methods
   */
 
   return {
     init
   }
 
 })();
 
 ProjectMonitoring.init();