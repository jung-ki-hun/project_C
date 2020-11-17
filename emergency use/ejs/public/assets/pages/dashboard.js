/*
 Template Name: Admiria - Bootstrap 4 Admin Dashboard
 Author: Themesbrand
 File: Dashboard Init
*/


!function($) {
    "use strict";

    var Dashboard = function() {};

    Dashboard.prototype.init = function () {

        // Peity line
        $('.peity-line').each(function() {
            $(this).peity("line", $(this).data());
        });

        //Knob chart
        $(".knob").knob();

        //C3 combined chart
        c3.generate({
            bindto: '#combine-chart',
            data: {
                columns: [
                    ['기상청', 30, 20, 50, 40, 60, 50],
                    ['Clean', 200, 130, 90, 240, 130, 220],
                    ['other', 300, 200, 160, 400, 250, 250],
                    ['none1', 200, 130, 90, 240, 130, 220],
                    ['none2', 130, 120, 150, 140, 160, 150]
                ],
                types: {
                    기상청 : 'bar',
                    Clean: 'bar',
                    other: 'spline',
                    none1: 'line',
                    none2: 'bar'
                },
                colors: {
                    기상청: '#5468da',
                    Clean: '#4ac18e',
                    other: '#ffbb44',
                    none1: '#ea553d',
                    none2: '#6d60b0'
                },
                groups: [
                    ['기상청','Clean']
                ]
            },
            axis: {
                x: {
                    type: 'categorized'
                }
            }
        });

        //C3 Donut Chart
        c3.generate({
            bindto: '#donut-chart',
            data: {
                columns: [
                    ['기상청', 78],
                    ['Clean', 40],
                    ['Other', 25]
                ],
                type : 'donut'
            },
            donut: {
                title: "dust Analytics",
                width: 30,
                label: {
                    show:false
                }
            },
            color: {
                pattern: ["#5468da", "#4ac18e","#6d60b0"]
            }
        });

    },
        $.Dashboard = new Dashboard, $.Dashboard.Constructor = Dashboard

}(window.jQuery),

//initializing
    function($) {
        "use strict";
        $.Dashboard.init()
    }(window.jQuery);