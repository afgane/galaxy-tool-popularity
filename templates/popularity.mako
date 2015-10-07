<!DOCTYPE HTML>
<html>
<head>
    <title>${ title }</title>
    ${h.css( 'base' )}

    ${h.js( 'libs/jquery/jquery',
            'libs/underscore',
            'libs/backbone/backbone',
            'libs/require'
    )}
    <script type="text/javascript" src="/plugins/visualizations/popularity/static/popularity.js"></script>
</head>

<body>
    <div class="chart-header">
        <h2>${title}</h2>
    </div>
    <div id="tools-container">
        Please wait - computing tool popularity...
    </div>

    <script type="text/javascript">
        window.view = new Popularity();
    </script>
</body>
