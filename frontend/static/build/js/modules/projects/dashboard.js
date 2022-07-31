/**
 * ==============================================
 * * DASHBOARD
 * ==============================================
 */

(() => {

  // * Local Variables

  const CHART_BG = {
    light: '#e9ecef',
    info: '#2b6cb0',
    warning: '#c2410c',
    success: '#2f855a',
    danger: '#b91c1c',
    dark: '#a4adb5',
    secondary: '#b8b3ae'
  }

  let date;
  let time;
  let data;

  // * Private Methods

  const setDateTime = () => {
    const setDate = () => {
      const d = moment().format('dddd, MMMM D, YYYY');
      if (date !== d) setHTMLContent('#dashboard_dateTime_dateDisplay', d);
      if (!date) date = d;
    };

    const setTime = () => {
      const t = moment().format('hh:mm:ss A');
      if (time !== t) setHTMLContent('#dashboard_dateTime_timeDisplay', t);
      if (!time) time = t;
    };

    setInterval(() => {
      setDate();
      setTime();
    }, 50);
  }

  const getDashboardData = async () => {
    await $.ajax({
      url: `${ BASE_URL_API }/dashboard/cards`,
      type: 'GET',
      success: async res => {
        if (res.error) {
          ajaxErrorHandler(res.message);
        } else {
          console.log(res);

          data = res;
        }
      },
      error: (xhr, status, error) => {
        ajaxErrorHandler({
          file: 'projects/dashboard.js',
          fn: 'onDOMLoad.setDashboard()',
          xhr: xhr
        }, 1)
      }
    })
  }

  const setMainCards = async () => {
    const {
      total,
      created,
      ongoing,
      concluded,
    } = data;

    setHTMLContent({
      '#dashboard_mainCard_totalProjectProposals': total,
      '#dashboard_mainCard_totalCreatedProjects': created,
      '#dashboard_mainCard_totalOnGoingProjects': ongoing,
      '#dashboard_mainCard_totalConcludedProjects': concluded,
    });
  }

  const setProjectProposalForApproval = async () => {
    const {
      for_review,
      for_evaluation,
      pending,
      for_revision,
    } = data;

    const approvalData = [
      for_review,
      for_evaluation,
      pending,
      for_revision
    ];

    const donutChartCanvas = $('#donutChart').get(0).getContext('2d');
    let donutData = {
      datasets: [
        {
          backgroundColor : [
            CHART_BG.info,
            CHART_BG.success,
            CHART_BG.warning,
            CHART_BG.danger,
          ],
          borderColor: '#fff',
          borderWidth: 2,
        }
      ]
    };
    
    // if (approvalData.reduce((a, b) => a+b, 0) > 0) {
      donutData.labels = [
        'For Review',
        'For Evaluation',
        'Pending',
        'For Revision',
      ];
      donutData.datasets[0].data = approvalData;
      donutData.datasets[0].backgroundColor = [
        CHART_BG.info,
        CHART_BG.success,
        CHART_BG.warning,
        CHART_BG.danger,
      ];
    // } else {
    //   donutData.labels = ['No data'];
    //   donutData.datasets[0].data = [100];
    //   donutData.datasets[0].backgroundColor = [CHART_BG.dark]
    // }
    
    let donutOptions = {
      maintainAspectRatio : false,
      responsive : true,
    }

    const chart = await new Chart(donutChartCanvas, {
      type: 'doughnut',
      data: donutData,
      options: donutOptions
    })
  }

  // * Public Methods

  // * Init

  const init = async () => {
    setDateTime();
    await getDashboardData();
    await setMainCards();
    await setProjectProposalForApproval();
  }

  // * Return Public Methods
  return {
    init
  }
})().init();