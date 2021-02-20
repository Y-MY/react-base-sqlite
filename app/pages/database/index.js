import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import Topbar from '../../components/topbar/topbar';
import {dbFileName} from "../../config";
import {connect} from "react-redux";

import "./style/index.less";
import {Button} from "antd-mobile";

const prefix = "sqlite";

const dbPath = `_doc/${dbFileName}`;

class Sqlite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data1: JSON.stringify([{
                "BJQE0100": "2051c3b6-d417-4ab5-83db-95f3828a4e0c",
                "BJQE0101": "2020临时部务会会议",
                "BJQE0102": "",
                "BJQE0103": "",
                "BJQE0104": "2020-11-06",
                "BJQE0105": "",
                "BJQE0106": "",
                "BJQE0107": "",
                "InpFrq": 1
            }]),
            data2: JSON.stringify([{"ID": 1, "CONTENT": "2019-06-2127"}, {
                "ID": 2,
                "CONTENT": "1be499478bf2a633"
            }, {"ID": 3, "CONTENT": "0"}, {"ID": 4, "CONTENT": "1"}, {"ID": 5, "CONTENT": "0"}, {
                "ID": 6,
                "CONTENT": "1"
            }, {"ID": 7, "CONTENT": "1"}, {"ID": 8, "CONTENT": "金华市任免上会"}, {"ID": 9, "CONTENT": "1"}, {
                "ID": 10,
                "CONTENT": "1"
            }, {"ID": 11, "CONTENT": "0"}, {"ID": 12, "CONTENT": "0"}])
        }
    }

    componentDidMount() {
        const _this = this;
        try {

            //检查是否存在数据库，如果不存在，则将static文件夹中预制数据库复制过去
            plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function (fs) {
                //查找数据库文件
                //console.log('***********fs***********', JSON.stringify(fs))
                fs.root.getFile(dbFileName, {create: false}, function (fileEntry) {
                    //存在则无动作
                    console.log('文件已存在')
                    _this.dbOperation();
                }, function (e) {
                    console.log('文件不存在')
                    //不存在则复制
                    //查找static文件夹下的数据库
                    plus.io.resolveLocalFileSystemURL(`_www/assets/db/${dbFileName}`, function (entry) {
                        //找到则复制过去
                        //获取目标地址
                        //\内部存储设备\Android\data\io.dcloud.HBuilder\apps\HBuilder\doc
                        console.log('***********entry***********' + entry.fullPath)
                        plus.io.resolveLocalFileSystemURL('_doc/', function (docEntry) {
                            //源地址到目标地址复制
                            console.log('***********docEntry***********' + docEntry.fullPath)
                            entry.copyTo(docEntry, dbFileName, function (copyEntry) {
                                console.log('复制成功！')
                                console.log("New Path: " + copyEntry.fullPath);
                                _this.dbOperation();
                            }, function (error) {
                                console.log('复制失败！' + JSON.stringify(error))
                                plus.io.resolveLocalFileSystemURL(dbPath, function (docDbEntry) {
                                    docDbEntry.remove(function (removeEntry) {
                                        console.log('删除成功！')
                                        entry.copyTo(docEntry, dbFileName, function (copyEntry2) {
                                            console.log('第二次复制成功！')
                                            console.log("New Path: " + copyEntry2.fullPath);
                                            _this.dbOperation();
                                        }, function (e) {
                                            console.log('第二次复制失败！' + JSON.stringify(error))
                                            console.log(JSON.stringify(e))
                                        })
                                    }, function (removeError) {
                                        console.log('删除失败！' + JSON.stringify(removeError))
                                    })
                                })
                            });
                        });
                    });
                });
            });


            /* // let isOpen = plus.sqlite.isOpenDatabase({name: 'demo', path: '_doc/demo.db',});
             //调用数据库，查询任务名称列表
             plus.sqlite.selectSql({
                 name: 'first',
                 sql: 'select * from test',
                 success: function (data) {
                     console.log('selectSql2222 success: ');
                     for (var i in data) {
                         console.log(JSON.stringify(data[i]));
                         //this.taskList.push(data[i]);
                     }

                 },
                 fail: function (e) {
                     console.log('selectSql2222 failed: ' + JSON.stringify(e));
                 }
             });*/

        } catch (e) {
            console.log('该浏览器不支持plus');
        }
    }

    dbOperation = () => {
        const _this = this;
        let dbname = 'main';
        plus.sqlite.openDatabase({
            name: dbname,
            path: dbPath,
            success: function (e) {
                console.log('openDatabase : ' + JSON.stringify(e))
            },
            fail: function (e) {
                console.log('openDatabase failed: ' + JSON.stringify(e));
            }
        });

        plus.sqlite.selectSql({
            name: dbname,
            sql: `select * from PAD_BJQE01`,
            success: function (res) {
                _this.setState({data1: JSON.stringify(res)})
                console.log('selectSql success : ' + JSON.stringify(res))
            },
            fail: function (e) {
                console.log('selectSql fail : ' + JSON.stringify(e))
            }
        });

        plus.sqlite.selectSql({
            name: dbname,
            sql: `select * from PAD_MANAGER`,
            success: function (res) {
                _this.setState({data2: JSON.stringify(res)})
                console.log('selectSql success : ' + JSON.stringify(res))
            },
            fail: function (e) {
                console.log('selectSql fail : ' + JSON.stringify(e))
            }
        })
        _this.closeDatabase(dbname);
    }

    openDatabase = (dbname) => {
        return new Promise((resolve, reject) => {
            plus.sqlite.openDatabase({
                name: dbname,
                path: dbPath,
                success: function (e) {
                    resolve(dbname)
                    console.log('openDatabase : ' + JSON.stringify(e))
                },
                fail: function (e) {
                    console.log('openDatabase failed: ' + JSON.stringify(e));
                }
            });
        });
    }

    selectSql = (tableName) => {
        //create table if not exists test("where" CHAR(110),"location" CHAR(100),"age" INT(11))
        //select * from ${tableName} limit 10 offset ${offset}
        return new Promise((resolve, reject) => {
            plus.sqlite.selectSql({
                name: 'demo',
                sql: `select * from ${tableName}`,
                success: function (res) {
                    resolve(res)
                },
                fail: function (e) {
                    reject(e)
                }
            })
        });
    }
    executeSql = (sql) => {
        //create table if not exists test("where" CHAR(110),"location" CHAR(100),"age" INT(11))
        try {
            plus.sqlite.executeSql({
                name: 'demo',
                sql: sql,
                success: function (e) {
                    console.log('executeSql success!');
                },
                fail: function (e) {
                    console.log('executeSql failed: ' + JSON.stringify(e));
                }
            });
        } catch (e) {
            console.log('该浏览器不支持plus');
        }
    }


    closeDatabase = (dbname) => {
        try {
            plus.sqlite.closeDatabase({
                name: dbname,
                success: function (e) {
                    console.log('closeDatabase success!');
                },
                fail: function (e) {
                    console.log('closeDatabase failed: ' + JSON.stringify(e));
                }
            });
        } catch (e) {
            console.log('该浏览器不支持plus');
        }
    }

    handleDbfile = () => {
        plus.io.resolveLocalFileSystemURL(dbPath, function (docDbEntry) {
            docDbEntry.remove(function (removeEntry) {
                console.log('删除成功！')
                plus.io.resolveLocalFileSystemURL(`_www/assets/db/${dbFileName}`, function (entry) {
                    //找到则复制过去
                    //获取目标地址
                    //\内部存储设备\Android\data\io.dcloud.HBuilder\apps\HBuilder\doc
                    plus.io.resolveLocalFileSystemURL('_doc/', function (docEntry) {
                        //源地址到目标地址复制
                        console.log('***********docEntry***********' + docEntry.fullPath)
                        entry.copyTo(docEntry, dbFileName, function (copyEntry) {
                            console.log('复制成功！')
                            console.log("New Path: " + copyEntry.fullPath);
                        }, function (error) {
                            console.log('复制失败！' + JSON.stringify(error))
                        });
                    });
                });
            }, function (removeError) {
                console.log('删除失败！' + JSON.stringify(removeError))
            })
        })
    }

    goBack = () => {
        this.props.history.goBack();
    };

    render() {
        return (
            <div className={prefix}>
                <Topbar title="数据库" onClick={() => this.props.history.goBack()}/>
                <div className={prefix + "-box"}>
                    <p>当条记录：</p>
                    <p>{this.state.data1}</p>
                    <br/>
                    <p>多条记录：</p>
                    <p>{this.state.data2}</p>
                    {/* <Button onClick={() => this.props.history.push('/database')}>同步数据库文件</Button>*/}
                </div>
            </div>
        );
    }
}

export default connect(null, null)(withRouter(Sqlite));
