import {createApp} from 'vue'
import App from './App.vue'
import {Button, Col, Form, Input, InputNumber, Row, Select, Space, Table} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App)

app.use(Button)
    .use(Form)
    .use(Input)
    .use(InputNumber)
    .use(Select)
    .use(Space)
    .use(Table)
    .use(Row)
    .use(Col);

app.mount('#app');
