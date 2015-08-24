var original_table = new Array();
var afterchange_table =new Array();
var update_ciattr = new Object();
//由于不同浏览器中，typeof函数的返回值不一样，就用此数组判断ciattrfid是否已经存在
var ciattrfid_array = new Array();
var ci_name = "";
var ciattr_fid = "";
//保存点击模态框确定按钮响应的动作 1.changelog时的确定   2.添加完成后的确定
var modal_action = 0;   
var changelog = "";

$(document).ready(function(){
    //主机详细信息页面，该主机所应用的基线列表
    $baselinelist = $('#hiden_baselinelist').val();
    var baseline_type="";
    $('#checkedBaseline').DataTable( {
        "bAutoWidth": false,                                        //页面自动宽度
        "processing" : true,
        "bPaginate": false,                                        //页面分页（右下角）
        "dom": 't',
        "ajax" : {
            "url" : "/ajax_baselinelist?tag=" + $baselinelist,
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
    });

    $cilist = $('#hiden_cilist').val().split(';');
    var ci_name = "";
    //因为页面中穿过来的cilist是以；作为分割的，拼接的时候是以；开头的，故以下标1开始
    for(var i=1; i<$cilist.length; i++)
    {
        $('#' + $cilist[i]).DataTable( {
            "bAutoWidth": false,                                        //页面自动宽度
            "processing" : true,
            "bPaginate": false,                                        //页面分页（右下角）
            "dom": 't',
            "ajax" : {
                "url" : "/ajax_ciattr?ci_fid=" + $cilist[i],
                "dataSrc" : "",
                "async" : false, 
                "bDeferRender": true
            },
            "aoColumns": [
                { "data": "FAMILY_ID"},
                { "data": "CIAT_NAME"},
                { "data": "VALUE"},
                { "data": "DESCRIPTION" },
                { "data": "CHANGE_LOG"},
                { "data": "CI_NAME"},
            ],
            "columnDefs": [ 
                {
                "targets": 0,
                "mRender" : function(data, type, full){
                                ciattr_fid = data;
                                return 1;
                            },
                "bVisible" : false,
                },
                {
                "targets": 1,
                "mRender" : function(data, type, full){
                                return data;
                            }
                },
                {
                "targets": 2,
                "mRender" : function(data, type, full){
                                if (data.length<20)
                                    return "<div id=\""+ciattr_fid+"\" style=\"width:300px;\">"+data+"</div>";
                                else
                                    return "<div id=\""+ciattr_fid+"\" style=\"width:300px; text-overflow: ellipsis;overflow: hidden\">"+data+"</div>";
                            }
                },
                {
                "targets" : 5,   
                "searchable" : false,
                "orderable" : false,
                "bVisible" : false,
                "mRender" : function(data, type, full){
                                ci_name = "";
                                ci_name = data;
                                return 0;
                            }
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
        $("#div"+$cilist[i]).append('<h4>配置项：'+ ci_name +'</h4>');
    }
    
    //实现点击行，变为输入框字段
    var content;   
    for (var i= 1; i<3;i++)
    {
        $('table tr').find("td:eq("+i+")").click(function(){
            var clickObj = $(this); 
      
            //获取当前操作对象
            if (clickObj.children().html()==null)//第三列的情况
                content = clickObj.html();
            else//第二列的情况
                content = clickObj.children().html();
              
            changeToEdit(clickObj, content);
        }); 
    }
});

function changeToEdit(node, content){ 
    var ciattr_fid_choosed = "";
    var td_r = node.parent().prevAll().length + 1                   //第几行
    var td_c = node.prevAll().length+1                              //第几列
    var input_id = td_r + td_c;                        //点击变成input后的input id
    if (td_c == 2)
        ciattr_fid_choosed = node.children().attr("id");
    else
        ciattr_fid_choosed = node.prev().children().attr("id");
    var node_html = node.html();  
    node.html("");
    var inputObj = $("<input id='"+input_id+"' type='text' class='form-control'/></div>"); 
    //插入一个可编辑的 input对象
    inputObj.css("border","1").css("background-color",node.css("background-color"))
        .css("font-size",node.css("font-size")).css("height","120%")
        .css("width", "95%").val(content).appendTo(node) 
    $('#'+input_id).focus();
    
    inputObj.click(function(){ 
        return false; 
    }).keyup(function(event){ 
        var keyvalue = event.which; 
        if(keyvalue==13){//回车键 
            $("#div_cichange").show();
            //如果修改后的值与之前值相同，那么不操作
            var afterchange_val = node.children("input").val();
            if(afterchange_val == content)
                node.html(node_html)   
            else
            {
                //修改ci attr value
                if (td_c == 2){          //如果改的是第二列
                    //如果数组中存在该条记录，则更新值；否则新增一个数组
                    if (ciattrfid_array.indexOf(ciattr_fid_choosed) == -1)
                    {   
                        ciattrfid_array.push(ciattr_fid_choosed);
                        update_ciattr[ciattr_fid_choosed] = new Array();
                    } 
                    update_ciattr[ciattr_fid_choosed][0] = afterchange_val;
                }
                //修改ci attr description
                else if (td_c == 3){     //如果改的是第三列
                    if (ciattrfid_array.indexOf(ciattr_fid_choosed) == -1)
                    {
                        ciattrfid_array.push(ciattr_fid_choosed);
                        update_ciattr[ciattr_fid_choosed] = new Array();
                    }
                    update_ciattr[ciattr_fid_choosed][1] = afterchange_val;
                }
                if(afterchange_val.length < 20)
                    var after_html = "<div id=\""+ciattr_fid_choosed+"\" style=\"width:300px; text-overflow: ellipsis;overflow: hidden\">"+afterchange_val+"</div>";  
                else
                    var after_html = "<div id=\""+ciattr_fid_choosed+"\" style=\"width:300px;\">"+afterchange_val+"</div>"
                node.html(after_html)        
                //将修改后的值显示在table中
                //save_change(node,content,afterchange_val);
            }
        } 
        if(keyvalue==27){ //27是esc键
            node.html(node_html);
        } 
    }).blur(function()//失去焦点情况
    {
        $("#div_cichange").show();
        var afterchange_val = node.children("input").val();
        if(afterchange_val == content)
            node.html(node_html)       
        else
        {
            //修改ci attr value
            if (td_c == 2){ //如果改的是第二列
                //如果数组中存在该条记录，则更新值；否则新增一个数组
                if (ciattrfid_array.indexOf(ciattr_fid_choosed) == -1)
                {   
                    ciattrfid_array.push(ciattr_fid_choosed);
                    update_ciattr[ciattr_fid_choosed] = new Array();
                } 
                update_ciattr[ciattr_fid_choosed][0] = afterchange_val;
            }
            //修改ci attr description
            else if (td_c == 3){ //如果改的是第三列
                if (ciattrfid_array.indexOf(ciattr_fid_choosed) == -1)
                {
                    ciattrfid_array.push(ciattr_fid_choosed);
                    update_ciattr[ciattr_fid_choosed] = new Array();
                }
                update_ciattr[ciattr_fid_choosed][1] = afterchange_val;
            }
            if(afterchange_val.length < 20)
                var after_html = "<div id=\""+ciattr_fid_choosed+"\" style=\"width:300px; text-overflow: ellipsis;overflow: hidden\">"+afterchange_val+"</div>";  
            else
                var after_html = "<div id=\""+ciattr_fid_choosed+"\" style=\"width:300px;\">"+afterchange_val+"</div>"
            
            node.html(after_html)        
            //将修改后的值显示在table中
            //save_change(node,content,afterchange_val);
        }
    });
}

function submit_cichanges()
{
    $("#modal_info").modal("show");
    modal_action = 1;
    
}

//模态框中点击确定后触发的动作
function modal_sure()
{
    //显示changelog时，点击确定的动作
    if (modal_action == 1) {
        changelog = $('#modal_ta_changelog').val();
        $('#modal_content').html("开始修改配置...");
        $('#modal_ta_changelog').val("");
        setTimeout("ciattr_modify()", 1000); 
    }else if (modal_action == 2){
        $("#modal_info").modal("hide");
        location.reload();
    }
    modal_action = 0;
}

function ciattr_modify() {
    var err_content = ""
    var err_index = 0;
    $.ajaxSettings.async = false;               //设置ajax同步执行
    for (item in update_ciattr)
    {
        var attr_fid = item;
        var attr_value = update_ciattr[item][0];
        var attr_des = update_ciattr[item][1];
        
        var str_url = "/ajax_ciattr";
        if (attr_fid == undefined)
        {
            err_index += 1;
            err_content += "<p>" + err_index +". 没有获取CIATTR_FID,故记录：value" + 
                        attr_value + ", des" + 
                        attr_des + "，无法进行更新操作</p>";
            continue;
        }
        
        str_url +="?fid=" + attr_fid;
        //判断对象为空
        if (attr_value != undefined)
            str_url += "&value=" + attr_value;
        if (attr_des != undefined)
            str_url += "&description=" + attr_des;
        if (changelog != "")
            str_url += "&changelog=" + changelog;
            
        $.ajax({
            type: "PUT",
            url: str_url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data){
                return;
            },
            error: function (msg) {
                err_index += 1;
                err_content += "<p>" +err_index+". 更新操作失败-" + str_url + "</p>";
            },
        });
    }
    
    if (err_index != 0)
        $('#modal_content').html(err_content);
    else
        $('#modal_content').html("配置修改成功！");
    
    modal_action = 2;
    
}