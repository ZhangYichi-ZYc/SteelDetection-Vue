使用Vue完成一个简单的AI对话组件。组件以悬浮球的方式呈现，点击后可以在页面最上方展开一个对话框。


请求方式如下
curl https://gpt.api.zhangyichi.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-temG8svNtRWytx1TIIkgHL6yNbXIO6edjx9mio3Lj7iQ0W5j" \
  -d '{
        "model": "deepseek-chat",
        "messages": [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "Hello!"},
          {"role": "assistant", "content": "Hello!"},
          {"role": "user", "content": "Hello!"}
        ],
        "stream": false
      }'


服务给出的返回示例如下：
{
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "logprobs": null,
      "message": {
        "content": "Hello again!  How can I assist you today?",
        "role": "assistant"
      }
    }
  ],
  "created": 1744183675,
  "id": "0217441836750206aae6d2807745e61582b53686b35eaedd745b1",
  "model": "deepseek-v3-250324",
  "service_tier": "default",
  "object": "chat.completion",
  "usage": {
    "completion_tokens": 12,
    "prompt_tokens": 18,
    "total_tokens": 30,
    "prompt_tokens_details": {
      "cached_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0
    }
  }
}

最好把上面的的代码具体要干什么，怎么做到的也讲清楚，具体可以实现什么样的操作，按钮输入什么得到什么