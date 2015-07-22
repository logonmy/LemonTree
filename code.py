#coding:utf-8
import web
import sys
import httplib, urllib
import json
from OracleConnector import OracleConnector
import cmdbAPI

ERR_URL_WITHTOUT_NECESSARY_ATTR = 1

reload(sys)
sys.setdefaultencoding('utf-8')

urls = (
        '/index'            ,'index',
        '/hostinfo'         ,'hostinfo',
        '/hostlist'         ,'hostlist',
        '/hostbaselinelist' ,'hostbaselinelist',
        '/addhost'          ,'addhost',
        
        '/ajax_gethostlist' ,'ajax_gethostlist',
        
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
        render = web.template.render('templates/', base='layout')
        return render.index(name)
     
    def POST(self):
        pass
        
class hostinfo:
    def GET(self):
        server = web.input(host = "slave1")     #页面url中传入的参数：主机名
        render = web.template.render('templates/host/', base='layout_info')
        if server is None:
            return render.hostinfo()
        
        conn  =  HttpConnectionInit()
        #返回主机所有CI TYPE
        url_citype = "/citype?owner=OS"
        conn.request(method = "GET",url = url_citype)
        data_citype = json.loads(conn.getresponse().read())

        list_citype = []
        for citype in data_citype:
            temp_dict = {}
            for key,value in citype.items():
                o_key = key.encode('utf-8')
                if not value:
                    o_value = ""
                else:
                    o_value = value.encode('utf-8') 
                temp_dict[o_key] = o_value
                
            list_citype.append(temp_dict)

        #返回对应主机名下的所有CI
        url_ci = "/cirela?sourcename=" + server.host
        conn.request(method = "GET",url = url_ci)
        data_ci = json.loads(conn.getresponse().read())
        
        dict_ci = {}
        for ci in data_ci:
            temp_cidict = {}
            if ci["TARGET_TYPE_FID"].encode('utf-8') not in dict_ci:
                dict_ci[ci["TARGET_TYPE_FID"].encode('utf-8')] = []
            for key,value in ci.items():
                o_key = key.encode('utf-8')
                if not value:
                    o_value = ""
                else:
                    o_value = value.encode('utf-8')
                temp_cidict[o_key] = o_value
            dict_ci[ci["TARGET_TYPE_FID"].encode('utf-8')].append(temp_cidict)

        HttpConnectionClose(conn)
        return render.hostinfo(list_citype, dict_ci, host = server.host)

    def POST(self):
        pass
    
class hostlist:
    def GET(self):
        render = web.template.render('templates/host/', base='layout')
        return render.hostlist()
        
    def POST(self):
        pass

class hostbaselinelist:
    def GET(self):
        render = web.template.render('templates/host/', base='layout')
        return render.hostbaselinelist()
    
    def POST(self):
        pass
    
class addhost:
    def GET(self):
        render = web.template.render('templates/host/', base='layout_info')
        return render.addhost()
         
 
if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
