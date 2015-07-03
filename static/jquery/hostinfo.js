$(document).ready(function(){
    $cilist = $('#cilist').val().split(';');
    for(var i=1; i<$cilist.length; i++)
    {
        $('#'+$cilist[i]).dataTable( {
            "processing" : true,
            "bPaginate": false,
            "sDom" : '<"toolbar_'+ $cilist[i] +'">frti',
            "ajax" : {
                "url" : "/getci?cifid=" + $cilist[i],
                "dataSrc" : "",
                "async" : false, 
                "bDeferRender": true
                
            },
            "columns": [
                { "data": "CIAT_NAME" },
                { "data": "VALUE" },
                { "data": "DESCRIPTION" },
                { "data": "CI_NAME", "bVisible" : false}
            ]
        } );
        
        $("div.toolbar_" + $cilist[i]).html();
    }
    
    
});

