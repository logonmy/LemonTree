var baseline_type="";
$(document).ready(function(){
    var table = $('#allbaselinelist').DataTable( {
        "bAutoWidth": false,                                        //页面自动宽度
        "processing" : true,
        "bPaginate": true,                                        //页面分页（右下角）
        "aLengthMenu":  [[10, 25, 50, -1], ["每页10条", "每页25条", "每页50条", "显示所有数据"]],
        "ajax" : {
            "url" : "/ajax_get_baseline_list",
            "dataSrc" : "",
            "async" : false, 
            "bDeferRender": true
        },
        "aoColumns": [
            { "data": "TYPE"},
            { "data": "DISPLAYNAME"},
            { "data": "DESCRIPTION" },
        ],
        "columnDefs": [ 
            {
            "targets": 0,
            "mRender" : function(data, type, full){
                            baseline_type = data;
                            return 0;
                        },
            "bVisible" : false,
            },
            {
            "targets": 1,
            "mRender" : function(data, type, full){
                            return "<a href=\"/baselineinfo?type="+baseline_type+"&title="+data+"\" target=\"_black\">"+data+"</a>";
                        }
            },
            {
            "searchable" : false,
            "orderable" : false,
            "targets" : 2,    
            },
             
        ],
        "oLanguage": {                                             //自定义内容——国际化
            "sLengthMenu": "显示 _MENU_ ",
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            //"sInfo": "共 _TOTAL_ 个主机",
            "sInfoEmpty": "没有相关数据",
            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
            "oPaginate": {
                "sFirst": "首页" ,
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "尾页"
            },
            "sZeroRecords": "没有检索到数据",
            "sInfoEmtpy": "找不到相关数据",    
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",    
            "sProcessing": "正在加载中...",    
            "sSearch": "搜索：",    
        }
    } );

    $('a.toggle-vis').on( 'click', function (e) {
        e.preventDefault();
        // Get the column API object
        var column = table.column( $(this).attr('data-column') );
        // Toggle the visibility
        column.visible( ! column.visible() );
    } );

    //$("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
});



