$(document).ready(function(){
    var table = $('#allhostlist').DataTable( {
        "bAutoWidth": false,                                        //页面自动宽度
        "processing" : true,
        "bPaginate": true,                                        //页面分页（右下角）
        "aLengthMenu":  [[10, 25, 50, -1], ["每页10条", "每页25条", "每页50条", "显示所有数据"]],
        "ajax" : {
            "url" : "/ajax_get_hostlist",
            "dataSrc" : "",
            "async" : false, 
            "bDeferRender": true
        },
        "aoColumns": [
            { "data": "NAME" },
            { "data": "OS_VERSION" },
            { "data": "DESCRIPTION" },
        ],
        "columnDefs": [ 
            {
            "targets": 0,
            "mRender" : function(data, type, full){
                            return "<a href=\"/hostinfo?host="+data+"\" target=\"_black\">"+data+"</a>";
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
        },
        "fnDrawCallback": function () {
            $('#allhostlist tbody th').editable( 
                './editable_ajax.php', {
                "callback": function( sValue, y ) {
                    /* Redraw the table from the new data on the server */
                    oTable.fnDraw();
                },
                "height": "14px"
            } );
        }
    } );

    $('a.toggle-vis').on( 'click', function (e) {
        e.preventDefault();
        // Get the column API object
        var column = table.column( $(this).attr('data-column') );
        // Toggle the visibility
        column.visible( ! column.visible() );
    } );

    var content;   
    $('#allhostlist tbody th').click(function(){
        var clickObj = $(this); 
  
        //获取当前操作对象
        content = clickObj.html();
        changeToEdit(clickObj, content);
    }); 

});



