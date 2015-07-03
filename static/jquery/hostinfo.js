$(document).ready(function(){
    $cilist = $('#cilist').val().split(';');
    for(var i=1; i<$cilist.length; i++)
    {
        $('#'+$cilist[i]).dataTable( {
            "bAutoWidth": true,                                        //页面自动宽度
            "processing" : true,
            "bPaginate": false,                                        //页面分页（右下角）
            "sDom" : '<"toolbar_'+ $cilist[i] +'">frti',               //自定义组件排版
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
                { "data": "CI_NAME" },
                //, "bVisible" : false}
            ],
            "oLanguage": {                                             //自定义内容——国际化
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉， 没有找到",
                //"sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfo": "共 _TOTAL_ 个属性",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {
                    "sFirst": "首页" ,
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
                "sZeroRecords": "没有检索到数据",
            }
        } );
       
    }
    
    
});

