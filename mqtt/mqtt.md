# mqtt

使用mqtt来作为消息的发布和订阅，客户端进行一次连接，可以订阅多个主题。
接受多个主题的消息，通过topic区分消息是来自哪次订阅。
抢占式消费，即谁先收到谁消费。

## 用法
### 1. main.js
全局注册，一次连接
```js
const mqtt = new Mqtt()
Vue.prototype.$mqtt = mqtt

// 连接mqtt
mqtt.connect()
```
### 2. 需要接收消息的地方
订阅多个主题
```js
let sub1 = 'sub1'
let sub2 = 'sub2'
let sub3 = 'sub3'
this.$mqtt.subscribe(sub1, () => {
  console.log(sub1)
})
this.$mqtt.subscribe(sub2)
this.$mqtt.subscribe(sub3)
```
接受消息，根据主题分开消息体
```js
this.$mqtt.on((topic, message) => {
  const msg = JSON.parse(new TextDecoder('utf-8').decode(message)) // 解码消息
  console.log('mqtt', msg)
  switch (topic) {
    case sub1:
      console.log('sub1:'+ topic)
      break
    case sub2:
      console.log('sub2:'+ topic)
      break;
    case sub3:
      console.log('sub3;'+ topic)
      break
    default:
      console.log('error:'+ topic)
  }
})
```

以及其他方法
