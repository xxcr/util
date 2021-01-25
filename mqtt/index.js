import mqtt from 'mqtt'

class mqttUtil {
  setBaseInfo () {
    this.options = {
      clean: true,
      connectTimeout: 10000,
      clientId: '',
      username: '', // 连接的用户名
      password: '', // 密码
    }
    // TODO:mqtt服务器地址写成配置
    if (process.env.NODE_ENV !== 'development') {
      this.connectUrl = '' // 测试地址
    } else {
      this.connectUrl = '' // 生产地址
    }
    this.client = null
    this.reconnectTime = 0
  }

  // 连接mqtt
  connect () {
    this.setBaseInfo()
    this.client = mqtt.connect(this.connectUrl, this.options)
    this.client.on('connect', () => {
      console.log(`connect success!service:${this.connectUrl},clientId:${this.options.clientId}`)
    })
    this.client.on('reconnect', () => {
      console.log('正在重连MQTT!')
      this.reconnectTime++
      if (this.reconnectTime >= 10) {
        console.log('断开连接！')
        this.end()
      }
    })
    this.client.on('error', (error) => {
      console.log('连接MQTT失败:', error)
    })
  }

  // 订阅
  subscribe (sub, cb = null) {
    this.client.subscribe(sub, (err) => {
      if (!err) {
        if (cb) cb()
        console.log(`subscribe success!:${sub}`)
      }
    })
  }

  // 接收mqtt消息
  on (cb = null) {
    this.client.on('message', (topic, msg) => {
      if (cb) cb(topic, msg)
    })
  }

  // 取消订阅
  unsubscribe (sub, cb) {
    this.client.unsubscribe(sub, (err) => {
      if (!err) {
        console.log(`unsubscribe success!:${sub}`)
        cb()
      }
    })
  }

  // 发送mqtt消息
  send (sub, msg) {
    this.client.publish(sub, msg)
  }

  // 关闭mqtt
  end (cb) {
    this.client.end(() => {
      console.log('Mqtt closed')
      if (cb) cb()
    })
  }
}

export default mqttUtil
