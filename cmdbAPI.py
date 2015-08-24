#coding:utf-8
import web
import sys
import httplib, urllib
import json
from OracleConnector import OracleConnector
import code


ERR_POST = 2
ERR_GET_NULL = 3
ERR_URL_WITHTOUT_NECESSARY_ATTR = 4

ERR_RESULT_LEN = 11

reload(sys)
sys.setdefaultencoding('utf-8')


class ajax_ci:
    def GET(self):
        url = "/ci"
        token_init = 0
        result = web.input(citype_name = None, name=None, tag=None,  \
                           priority=None, owner=None, type_fid=None, \
                           family_id=None)
        
        page_attr = {'citype_name' : result.citype_name,                #CI TYPE的名字
                     'name'        : result.name,                       #CI 名字
                     'tag'         : result.tag,                        #标签
                     'priority'    : result.priority,                   #优先级 
                     'owner'       : result.owner,                      #属主
                     'type_fid'    : result.type_fid,                   #CI TYPE的family id
                     'family_id'   : result.family_id,                  #CI的family id
                     }
        
        listattr = [ k+'='+v for k, v in page_attr.iteritems() if not v is None ]
        url += "?" + "&".join(listattr)
        
        conn = code.HttpConnectionInit()
        conn.request(method = "GET",url = url)
        data = conn.getresponse().read()
        code.HttpConnectionClose(conn)
        return data

    def POST(self):
        result = web.input(description=None, tag=None, priority=0, owner=None)
        page_attr = {'name'         : result.ciname,
                     'ci_type_fid'  : result.ci_type_fid,
                     'description'  : result.description,
                     'tag'          : result.tag,
                     'priority'     : result.priority,
                     'owner'        : result.owner,
                     }
        
        if page_attr['name'] is None or page_attr['ci_type_fid'] is None:
            return ERR_URL_WITHTOUT_NECESSARY_ATTR
         
        for key, value in page_attr.items():
            if value is None:
                del page_attr[key]
         
        params = urllib.urlencode(page_attr)
        conn = code.HttpConnectionInit()
        conn.request("POST", "/ci", params)
        response = conn.getresponse()
        ret = response.read()
        
        code.HttpConnectionClose(conn)
        return ret

class ajax_cirela:
    def GET(self):
        pass
    
    def POST(self):
        result = web.input(owner = None)
        page_attr = {'source_fid' : result.source_fid,                #CI family_id
                     'target_fid' : result.target_fid,                #CI family_id
                     'relation'   : result.relation,                  #CI relation name
                     'owner'      : result.owner,                     #属主 
                     }
            
        if page_attr['source_fid'] is None or page_attr['target_fid'] is None  \
            or page_attr['relation'] is None:
            return ERR_URL_WITHTOUT_NECESSARY_ATTR
        
        for key, value in page_attr.items():
            if value is None:
                del page_attr[key]
         
        params = urllib.urlencode(page_attr)
        conn = code.HttpConnectionInit()
        conn.request("POST", "/cirela", params)
        response = conn.getresponse()
        ret = response.read()
        
        code.HttpConnectionClose(conn)
        return ret
    
class ajax_ciattr:
    def GET(self):
        url = "/ciattr"
        result = web.input(citype_name = None, ciat_name=None, ci_name=None,  \
                           type_fid=None, owner=None, ci_fid=None, \
                           family_id=None, time=None)
        
        page_attr = {'citype_name' : result.citype_name,
                     'ciat_name'   : result.ciat_name,
                     'ci_name'     : result.ci_name,
                     'type_fid'    : result.type_fid, 
                     'owner'       : result.owner,
                     'ci_fid'      : result.ci_fid,
                     'family_id'   : result.family_id,
                     'time'        : result.time,
                     }
        
        listattr = [ k+'='+v for k, v in page_attr.iteritems() if not v is None ]
        url += "?" + "&".join(listattr)
        
        conn = code.HttpConnectionInit()
        conn.request(method = "GET",url = url)
        data = conn.getresponse().read()
        
        code.HttpConnectionClose(conn)
        return data

    '''
    页面传入的参数为：
    必输入项：cifid， ciattr_type_fid，value
    可选输入项：description， owner
    '''
    def POST(self):
        result = web.input(cifid=None, ciattr_type_fid = None, \
                           value = None, description = None, owner = None, \
                           changelog = None)
        
        page_attr = {'ci_fid'          : result.cifid, 
                     'ci_attrtype_fid' : result.ciattr_type_fid,
                     'value'           : result.value,
                     'description'     : result.description,
                     'owner'           : result.owner,
                     'changelog'       : result.changelog,
                  }
        
        if page_attr['ci_fid'] is None or page_attr['ci_attrtype_fid'] is None \
            or page_attr['value'] is None:
            return ERR_URL_WITHTOUT_NECESSARY_ATTR
        
        for key, value in page_attr.items():
            if value is None:
                del page_attr[key]
        
        params = urllib.urlencode(page_attr)
        conn = code.HttpConnectionInit()
        conn.request("POST", "/ciattr", params)
        response = conn.getresponse()
        #插入成功则返回family id，否则返回 错误代码
        ret = response.read()

        code.HttpConnectionClose(conn)
        
        return ret
    
    def PUT(self):
        url = "/ciattr"
        result = web.input(fid=None, value=None, description=None, changelog=None)
        #页面无提交更新参数时，跳转到原页面
        if result is None:
            return web.template.render('templates/host/', base='layout').hostlist()
        
        page_attr = {'fid'          : result.fid,                   #CI attr family_id
                     'value'        : result.value,
                     'description'  : result.description, 
                     'change_log'   : result.changelog,
                     }
        if page_attr['fid'] is None or  page_attr['change_log'] is None:
            return ERR_URL_WITHTOUT_NECESSARY_ATTR

        for key, value in page_attr.items():
            if value is None:
                del page_attr[key]
                
        listattr = [ k+'='+v for k, v in page_attr.iteritems() if not v is None ]
        url += "?" + "&".join(listattr)

        conn  =  code.HttpConnectionInit()
        conn.request(method = "PUT",url = url)
        status = conn.getresponse().read()
        code.HttpConnectionClose(conn)
        #由于CMDB WEB API中post方法执行成功后返回值为ci attr的family id
        if status.startswith("FCAD"):
            status = 0;

        return status
    
class ajax_citype:
    def GET(self):
        url = "/citype"
        token_init = 0
        result = web.input(name = None, description=None, owner=None, \
                           family_id=None, time=None)
        
        page_attr = {'name'         : result.name,                   #CI TYPE的名字
                     'description'  : result.description,
                     'owner'        : result.owner,
                     'family_id'    : result.family_id,              #CI TYPE FAMILY_ID 
                     'time'         : result.time,
                     }
        
        for key, value in page_attr.items() :
            if value :
                if token_init == 0:
                    url += "?" + key + "=" + value
                    tokent_init = 1
                else:
                    url += "&" + key + "=" + value
        conn = code.HttpConnectionInit()
        conn.request(method = "GET",url = url)
        data = conn.getresponse().read()
        
        code.HttpConnectionClose(conn)
        return data

    def POST(self):
        pass
    
class ajax_cirelatype:
    def GET(self):
        pass
    
    def POST(self):
        pass
    
class ajax_ciattrtype:
    def GET(self):
        url = "/ciattrtype"
        token_init = 0
        result = web.input(citype_name = None, name=None,  ci_type_fid=None, \
                           owner=None, ci_fid=None, family_id=None, time=None)
        
        page_attr = {'citype_name' : result.citype_name,
                     'name'        : result.name,
                     'ci_type_fid' : result.ci_type_fid,
                     'owner'       : result.owner, 
                     'ci_fid'      : result.ci_fid,
                     'family_id'   : result.family_id,
                     'time'        : result.time,
                     }
        
        for key, value in page_attr.items():
            if value is None:
                del page_attr[key]
        
        listattr = [ k+'='+v for k, v in page_attr.iteritems() if not v is None ]
        url += "?" + "&".join(listattr)
        conn = code.HttpConnectionInit()
        conn.request(method = "GET",url = url)
        data = conn.getresponse().read()
        code.HttpConnectionClose(conn)
        return data

    
    def POST(self):
        pass

# class ajax_get_citype_all_attr:
#     def GET(self):
#         url_citypeattr = "/ciattrtype"
#         token_init = 0
#         result = web.input(ci_type_fid = None)
#         
#         if result.ci_type_fid :
#             if token_init == 0:
#                 url_citypeattr += "?ci_type_fid=" + result.ci_type_fid
#                 token_init = 1
#             else:
#                 url_citypeattr += "&ci_type_fid=" + result.ci_type_fid
#         conn = code.HttpConnectionInit()
#         conn.request(method = "GET",url = url_citypeattr)
#         data = conn.getresponse().read()
#         
#         code.HttpConnectionClose(conn)
#         return data

'''
gethostlist类不仅仅是获取了ci，而且还要显示一些属性，所以，这个是两个api合并后的结果
不能直接ajax_ci，单独提出来作为一个类，相应hostlist页面
'''    
class ajax_get_hostlist:
    def GET(self):
        #返回主机所有CI TYPE
        url_citype = "/ci?citype_name=HOST_OS"
        conn = code.HttpConnectionInit()
        conn.request(method = "GET",url = url_citype)
        formatdata = json.loads(conn.getresponse().read())
        
        list_host = []                      #OS列表，保存所有主机
        #获取所有主机列表，每个OS信息对应一个字典
        for ci in formatdata:
            temp_dict= {}
            temp_dict["NAME"] = ci["NAME"]
            temp_dict["DESCRIPTION"] = ci["DESCRIPTION"]

            url_ciattr = "/ciattr?ci_fid=" + ci["FAMILY_ID"]
            conn.request(method="GET", url = url_ciattr)
            data_ciattr = json.loads(conn.getresponse().read())
            #遍历OS的所有属性，将所有属性保存为key-value形式
            for eachattr in data_ciattr:
                temp_dict[eachattr["CIAT_NAME"]] = eachattr["VALUE"]
                
            list_host.append(temp_dict)
        
        code.HttpConnectionClose(conn)
        return json.dumps(list_host, indent = 4,ensure_ascii=False, separators = (',',':'))
    
class ajax_baselinelist:
    def GET(self):
        result = web.input(tag = None)
        formatdata = []     #查询数据库后，经过格式化后的值
        conditionList = []  #tag字段经过处理后的列表
        condition = None    #conditionList经过拼接后的条件字符串
        db = web.database(dbn='oracle', user='host', pw='host123', db='cffexcmdb')
        
        #tag: all or OS_RHEL6.3_X86|SE_RHEL6.3_X86 or None
        if result.tag == 'all':
            sql = 'select type, displayname, description from t_baseline'
        elif result.tag :
            conditionList = result.tag.split('|')
            #返回的x中示例为BASELINE:OS_RHEL6.3_X64，查询host模式下的baseline表时要把前面的baseline去掉
            conditionList = [ "type='" + x.split(':')[1] + "'" for x in conditionList]
            
            condition = " or ".join(conditionList)
        else :
            return formatdata

        if condition:
            sql = 'select type, displayname, description from t_baseline where ' + condition

        try:
            baseline_list = db.query(sql)
        except Exception as e:
            print e
            return -1;
        
        for item in baseline_list:
            formatdata.append(item)
        formatdata = json.dumps(formatdata, indent = 4,ensure_ascii=False, separators = (',',':'))
        
        return formatdata
    
    def POST(self):
        result = web.input(type = None, displayname = None, description = None)
        
        page_attr = {
                     "type"         : result.type,
                     "displayname"  : result.displayname,
                     "description"  : result.description
                     }
        
        if page_attr["type"] is None:
            return ERR_URL_WITHTOUT_NECESSARY_ATTR;
        
        db = web.database(dbn='oracle', user='host', pw='host123', db='cffexcmdb')
        try:
            ret = db.insert('T_BASELINE', type = page_attr['type'],
                  displayname = page_attr['displayname'],
                  description = page_attr['description'])
        except Exception as e:
            print e
            ret = e;
        
        if ret is None:
            ret = 1;
            
        return ret
        
    
'''
函数实现对CI进行完整的复制，包括属于该CI的attribute
'''
class ajax_copy_ci:
    def POST(self):     
        result = web.input(cifid=None)
        page_attr = {'fid' : result.cifid}
        
        #页面获取无cifid时，异常退出
        if page_attr['fid'] is None:
            return ERR_URL_WITHTOUT_NECESSARY_ATTR
        
        conn = code.HttpConnectionInit()
        #查询该ci的所有属性（T_CI的属性），并新增一条相同的ci
        url_ci = "/ci?family_id=" + page_attr['fid']
        conn.request(method = "GET",url = url_ci)
        formatdata = json.loads(conn.getresponse().read())
        if len(formatdata) != 1:
            print "[%s] 查询返回的list长度不为1" % self.__class__.__name__
            return ERR_RESULT_LEN
        
        attributes = {
                      'name'         : formatdata[0]['NAME'],
                      'ci_type_fid'  : formatdata[0]['TYPE_FID'],
                      'description'  : formatdata[0]['DESCRIPTION'],
                      'tag'          : None,
                      'priority'     : None,
                      'owner'        : None,
                      }
        
        for key, value in attributes.items():
            if value is None:
                del attributes[key]
        
        params = urllib.urlencode(attributes)
        conn.request("POST", "/ci", params)
        newcifid = conn.getresponse().read()

        if not newcifid.startswith("FCID"):
            print "[%s] 新增CI失败，无法获取新增CI FAMILY_ID" % self.__class__.__name__
            return ERR_POST
        
        #查询ci的所有attr
        url_ciattr = "/ciattr?ci_fid=" + page_attr['fid']
        conn.request(method = "GET",url = url_ciattr)
        
        formatdata = json.loads(conn.getresponse().read())
        if formatdata is None:
            print "[%s] 查询的ci不存在" % self.__class__.__name__
            return ERR_GET_NULL
        #遍历ci的所有attr，并将attr插入到T_CIATTR表中
        for attr in formatdata:
            attr_params = {
                           'ci_fid'          : newcifid,
                           'ci_attrtype_fid' : attr['TYPE_FID'],
                           'value'           : attr['VALUE'], 
                           'description'     : attr['DESCRIPTION'], 
                           'owner'           : attr['OWNER'],
                           }
            
            for key, value in attr_params.items():
                if value is None:
                    del attr_params[key]

            attr_params = urllib.urlencode(attr_params)
            #将属性插入到新的ci中
            conn.request("POST", "/ciattr", attr_params)
            response = conn.getresponse().read()
            if not response.startswith('FCAD'):
                print "[%s] 插入ci attr失败，属性为：%s" % (self.__class__.__name__, attr_params)
        
        code.HttpConnectionClose(conn)

        return newcifid
        