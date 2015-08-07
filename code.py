#coding:utf-8
import web
import sys
import httplib, urllib
import json
from OracleConnector import OracleConnector

ERR_URL_WITHTOUT_NECESSARY_ATTR = 1

reload(sys)
sys.setdefaultencoding('utf-8')


urls = (
        '/index'            , 'index',
        '/hostinfo'         , 'hostinfo',
        '/hostlist'         , 'hostlist',
        '/baselinelist'     , 'baselinelist',
        '/baselineinfo'     , 'baselineinfo',
        '/addhost'          , 'addhost',
        
        '/ajax_get_hostlist'    , 'cmdbAPI.ajax_get_hostlist',
        
        '/ajax_ci'              , 'cmdbAPI.ajax_ci',
        '/ajax_cirela'          , 'cmdbAPI.ajax_cirela',
        '/ajax_ciattr'          , 'cmdbAPI.ajax_ciattr',
        '/ajax_citype'          , 'cmdbAPI.ajax_citype',
        '/ajax_cirelatype'      , 'cmdbAPI.ajax_cirelatype',
        '/ajax_ciattrtype'      , 'cmdbAPI.ajax_ciattrtype',
        
        '/ajax_get_ci_all_attr'      , 'cmdbAPI.ajax_get_ci_all_attr',
        '/ajax_get_citype_all_attr'  , 'cmdbAPI.ajax_get_citype_all_attr',
        
        #'/ajax_get_citype'           , 'cmdbAPI.ajax_get_citype',
        '/ajax_get_baseline_list'    , 'cmdbAPI.ajax_get_baseline_list',
        '/ajax_get_baseline_osuser'  , 'cmdbAPI.ajax_get_baseline_osuser',
        
        '/ajax_copy_ci'              , 'cmdbAPI.ajax_copy_ci',
        
        '/ajax_post_ci' , 'cmdbAPI.ajax_post_ci',
        '/ajax_post_attr', 'cmdbAPI.ajax_post_attr',
       )


def HttpConnectionInit(host = '192.168.1.3', port = 8080):
    return httplib.HTTPConnection(host, port)

def HttpConnectionClose(connection):
    connection.close()

class index:
    def GET(self):
        name = None
        render = web.template.render('templates/', base='host/layout')
        return render.index(name)
     
    def POST(self):
        pass
        
class hostinfo:
    def GET(self):
        server = web.input()     #页面url中传入的参数：主机名和执行的类型
        render = web.template.render('templates/host/', base='layout_info')
        if server is None:
            return web.template.render('templates/host/', base='layout').hostlist()

        db = web.database(dbn='oracle', user='host', pw='host123', db='cffexcmdb')
        conn = HttpConnectionInit()
        #获取与该主机(CI)具有关系的所有CI项
        conn.request(method = "GET",url = "/cirela?sourcename=" + server.host)
        data = json.loads(conn.getresponse().read())

        baselist = []                       #保存该主机应用的基线类型
        #保存该主机非基线TAG的CI Dict，其中，以CITYPE作为key，value为属于这个TYPE的CI组成的list
        ciDictWithoutTag = {}
        #遍历该CI项，将基线CI与非基线CI分别保存到不同的列表中
        for ci in data:
            conn.request(method = "GET",url = "/ci?family_id=" + ci["TARGET_FID"].encode('utf-8') )
            resultCIList = json.loads(conn.getresponse().read())
         
            for each in resultCIList:
                if each["TAG"]:
                    baselist.append(each["TAG"])
                else:
                    if not ciDictWithoutTag.has_key(each['CITYPE_NAME']):
                        ciDictWithoutTag[each['CITYPE_NAME']] = []
                    ciDictWithoutTag[each['CITYPE_NAME']].append(each)
                    
        baselist = list(set(baselist))     
        baselist = "|".join(baselist)
        
        list_citype = None
        dict_ci = None
        HttpConnectionClose(conn)
        return render.hostinfo(baselist, ciDictWithoutTag, host = server.host)

    def PUT(self):
        url = "/ciattr"
        token_init = 0
        result = web.input(fid=None, value=None, des=None)
        #页面无提交更新参数时，跳转到原页面
        if result is None:
            return web.template.render('templates/host/', base='layout').hostlist()
        
        page_attr = {'fid'          : result.fid,                   #CI attr family_id
                     'value'        : result.value,
                     'description'  : result.des, 
                     }
        
        for key, value in page_attr.items() :
            if value :
                if token_init == 0:
                    url += "?" + key + "=" + value
                    token_init = 1
                else:
                    url += "&" + key + "=" + value
        
        conn  =  HttpConnectionInit()
        conn.request(method = "PUT",url = url)
        data = conn.getresponse().read()
        HttpConnectionClose(conn)
        #由于CMDB WEB API中post方法执行成功后返回值为ci attr的family id
        if data.startswith("FCAD"):
            status = 0;
        return status
    
class hostlist:
    def GET(self):
        render = web.template.render('templates/host/', base='layout')
        return render.hostlist()
        
    def POST(self):
        pass

class baselinelist:
    def GET(self):
        render = web.template.render('templates/host/', base='layout_info')
        return render.baselinelist()
    
    def POST(self):
        pass

class baselineinfo:
    def GET(self):
        result = web.input(type=None, title=None)
        render = web.template.render('templates/host/', base='layout_info')
        if result is None:
            return web.template.render('templates/host/', base='layout_info').baselinelist()
        
        #返回主机所有CI TYPE
        url_ci = "/ci?tag=" + result.type
        conn  =  HttpConnectionInit()
        conn.request(method = "GET",url = url_ci)
        data = json.loads(conn.getresponse().read())

        displayname_list = {}
        for each in data:
            typename = each["TYPE_DISPLAYNAME"]
            cifid = each["FAMILY_ID"]
            if displayname_list.get(typename) is None:
                displayname_list[typename] = []
            displayname_list[typename].append(cifid)
        
        title = result.title
        if title is None:
            title = result.type
        HttpConnectionClose(conn)
        return render.baselineinfo(displayname_list, title)
    
    def PUT(self):
        url = "/ciattr"
        token_init = 0
        result = web.input(fid=None, value=None, des=None)
        #页面无提交更新参数时，跳转到原页面
        if result is None:
            return web.template.render('templates/host/', base='layout_info').baselinelist()
        
        page_attr = {'fid'          : result.fid,                   #CI attr family_id
                     'value'        : result.value,
                     'description'  : result.des, 
                     'change_log'   : result.change_log,
                     }
        
        for key, value in page_attr.items() :
            if value :
                if token_init == 0:
                    url += "?" + key + "=" + value
                    token_init = 1
                else:
                    url += "&" + key + "=" + value
        
        conn  =  HttpConnectionInit()
        conn.request(method = "PUT",url = url)
        data = conn.getresponse().read()
        HttpConnectionClose(conn)
        #由于CMDB WEB API中post方法执行成功后返回值为ci attr的family id
        if data.startswith("FCAD"):
            status = 0;
        return status
        
        
class addhost:
    def GET(self):
        render = web.template.render('templates/host/', base='layout_info')
        return render.addhost()
         
 
if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
