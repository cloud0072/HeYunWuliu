<template>
  <div class="game">
    <div class="game-container">
      <!-- 正六边形 -->
      <div class="game-panel">
        <div class="panel-base">
          <div class="circle-flag"></div>

          <div class="circle-base circle-outer" :class="`${isActive('circle1') ? 'circle-base-active' : ''}`">
            <div class="circle-pointer" :style="{transform: `rotate(${table.circle1}deg) translateY(-50%)`}">
              <div class="circle-pointer-mask"></div>
            </div>
          </div>
          <div class="circle-base circle-middle" :class="`${isActive('circle2') ? 'circle-base-active' : ''}`">
            <div class="circle-pointer" :style="{transform: `rotate(${table.circle2}deg) translateY(-50%)`}">
              <div class="circle-pointer-mask"></div>
            </div>
          </div>
          <div class="circle-base circle-inner" :class="`${isActive('circle3') ? 'circle-base-active' : ''}`">
            <div class="circle-pointer" :style="{transform: `rotate(${table.circle3}deg) translateY(-50%)`}">
              <div class="circle-pointer-mask"></div>
            </div>
          </div>
          <div class="circle-base circle-bearing"></div>
        </div>
      </div>
      <div class="game-option">
        <div class="panel-option">
          <div class="action-option-title">罗盘状态</div>
          <a-form-item label="当前位置">
            <a-row :gutter="8">
              <a-col span="6">
                <a-select
                    style="width: 100%"
                    v-model:value="table.circle1"
                    :options="degOptions.filter((v,i)=> i>4)"
                    placeholder="请选择转动角度-外圈"
                />
              </a-col>
              <a-col span="6">
                <a-select
                    style="width: 100%"
                    v-model:value="table.circle2"
                    :options="degOptions.filter((v,i)=> i>4)"
                    placeholder="请选择转动角度-中圈"
                />
              </a-col>
              <a-col span="6">
                <a-select
                    style="width: 100%"
                    v-model:value="table.circle3"
                    :options="degOptions.filter((v,i)=> i>4)"
                    placeholder="请选择转动角度-内圈"
                />
              </a-col>
            </a-row>
          </a-form-item>
        </div>
        <div class="btn-option">
          <div class="action-option-title">罗盘按钮</div>
          <a-space>
            <a-button type="primary" @click="applyAction">旋转轮盘</a-button>
            <a-button type="primary" @click="switchAction">切换动作</a-button>
          </a-space>
        </div>
        <div class="action-option">
          <div class="action-option-title">动作配置</div>
          <template v-for="(item, index) in actions" :key="index">
            <a-form-item>
              <template #label>
                <div class="action-option-prefix">{{ actionIndex === index ? '>' : '' }}</div>
                {{ item.name }}
              </template>
              <a-row :gutter="8">
                <a-col span="6">
                  <a-select
                      style="width: 100%"
                      v-model:value="item.circle1"
                      :options="degOptions"
                      placeholder="请选择转动角度-外圈"
                  />
                </a-col>
                <a-col span="6">
                  <a-select
                      style="width: 100%"
                      v-model:value="item.circle2"
                      :options="degOptions"
                      placeholder="请选择转动角度-中圈"
                  />
                </a-col>
                <a-col span="6">
                  <a-select
                      style="width: 100%"
                      v-model:value="item.circle3"
                      :options="degOptions"
                      placeholder="请选择转动角度-内圈"
                  />
                </a-col>
                <a-col span="4">
                  <a-space>
                    <a-button @click="handleDelete(index)" type="primary" danger>
                      <delete-outlined/>
                      删除
                    </a-button>
                  </a-space>
                </a-col>
              </a-row>
            </a-form-item>
          </template>
          <a-button @click="handleAdd" type="primary">
            <plus-outlined/>
            新增Action
          </a-button>
        </div>
      </div>
      <div class="game-resolve">

      </div>
    </div>
  </div>
</template>

<script>
import {reactive, ref, toRefs} from "vue";
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons-vue';

export default {
  name: "GameTable",
  components: {
    PlusOutlined,
    DeleteOutlined
  },
  setup() {
    const state = reactive({
      // 当前选中动作
      actionIndex: 0,
      // 轮盘角度
      table: {
        circle1: 0,
        circle2: 0,
        circle3: 0,
      },
    })

    // 动作列表
    const actions = ref([
      {name: 'Action1', circle1: 60, circle2: 0, circle3: 0},
      {name: 'Action2', circle1: 0, circle2: 60, circle3: 0},
      {name: 'Action3', circle1: 0, circle2: 0, circle3: 60},
    ])

    const autoIncrement = ref(actions.value.length + 1);

    const degOptions = [...new Array(11).keys()].map((v, i) => {
      const n = -300 + i * 60;
      return {label: n + '°', value: n}
    })

    const handleAdd = () => {
      actions.value.push(
          {name: 'Action' + autoIncrement.value++, circle1: 0, circle2: 0, circle3: 0},
      )
    }

    const handleDelete = (index) => {
      actions.value.splice(index, 1)
    }

    const isActive = (name) => {
      const action = actions.value[state.actionIndex];
      return action[name] !== 0;
    }

    // 切换动作
    const switchAction = () => {
      state.actionIndex = state.actionIndex === actions.value.length - 1
          ? 0
          : state.actionIndex + 1;
    }

    // 执行动作
    const applyAction = () => {
      const {circle1, circle2, circle3} = state.table;
      const action = actions.value[state.actionIndex]
      state.table = {
        circle1: (circle1 + action.circle1),
        circle2: (circle2 + action.circle2),
        circle3: (circle3 + action.circle3),
      }
    }

    // 求解
    // 1 求解时 Action的先后次序不影响结果，求取最优解时 设最优解需要0-X步，枚举X步有多少种不同的Action组合，无解则X+1，有解则返回
    // 2 若 位置 % 360 = 0 则为正确位置
    const resolveAction = () => {
      // 尝试 50 次
      const times = 50;
      // 获取初始状态
      const { circle1, circle2, circle3 } = state.table;
      for (let i = 0; i < times; i++) {

      }
    }

    // actions种操作, 转动times次, 有多少种不通转动方式
    // 例 3种操作 转动4次
    /**
     * [
     * {a1: 4, a2: 0, a3: 0, a4: 0}
     * {a1: 3, a2: 1, a3: 0, a4: 0}
     * {a1: 3, a2: 0, a3: 1, a4: 0}
     * {a1: 3, a2: 0, a3: 0, a4: 1}
     * {a1: 2, a2: 2, a3: 0, a4: 0}
     * {a1: 2, a2: 0, a3: 2, a4: 0}
     * {a1: 2, a2: 0, a3: 0, a4: 2}
     * {a1: 2, a2: 1, a3: 1, a4: 0}
     * {a1: 2, a2: 1, a3: 0, a4: 1}
     * {a1: 2, a2: 0, a3: 1, a4: 1}
     * ]
     */
    const genStepList = (actions, times) => {

    }

    return {
      ...toRefs(state),
      actions,
      degOptions,
      applyAction,
      switchAction,
      isActive,
      handleAdd,
      handleDelete
    }
  }
}
</script>

<style lang="less">
@width: 120px;
@height: 208px;
@base-color: #292929;
@border-color: #474747;
@active-color: rgba(255, 186, 46, 0.8);
@pointer-color: #2d6abf;
@panel1: #292929;
@panel2: #292929;
@panel3: #292929;
@panel4: #292929;

.game {
  padding: 12px;
}

.game-title {
  line-height: 80px;
  width: 4*@width;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  font-family: monospace;
}

.game-container {
  display: flex;
}

.game-panel {
  position: relative;
  width: 4*@width;
  height: 2*@height;
  padding: 0 @width;
  box-sizing: border-box;
}

.panel-base {
  position: absolute;
  width: 2*@width;
  height: 2*@height;
  background: @base-color;
  z-index: 0;
}

.panel-base:before {
  position: absolute;
  top: 0;
  left: -@width;
  width: 0;
  height: 0;
  border-right: @width solid @base-color;
  border-left: none;
  border-top: @height solid transparent;
  border-bottom: @height solid transparent;
  content: "";
  z-index: 0;
}

.panel-base:after {
  position: absolute;
  top: 0;
  left: 2*@width;
  width: 0;
  height: 0;
  border-left: @width solid @base-color;
  border-right: none;
  border-top: @height solid transparent;
  border-bottom: @height solid transparent;
  content: "";
  z-index: 0;
}

.circle-flag {
  position: absolute;
  width: calc(2 * @width - 4px);
  height: 4px;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  background: @pointer-color;
  border-radius: 4px;
}

.circle-base {
  position: absolute;
  border-radius: 50%;
  border: 4px solid @border-color;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  overflow: hidden;
  box-sizing: border-box;

  &-active {
    border: 4px solid @active-color;
  }
}

.circle-pointer {
  position: absolute;
  width: 100%;
  height: 4px;
  left: 0;
  top: 50%;
  //transform: translateY(-50%);
  transition: all ease 300ms;
  border-radius: 2px;

  &-mask {
    width: 50%;
    height: 4px;
    background: @pointer-color;
  }
}

.circle-outer {
  width: 370px;
  height: 370px;
  z-index: 100;
  background: @panel1;
}

.circle-middle {
  width: 280px;
  height: 280px;
  z-index: 200;
  background: @panel2;
}

.circle-inner {
  width: 190px;
  height: 190px;
  z-index: 300;
  background: @panel3;
}

.circle-bearing {
  width: 100px;
  height: 100px;
  z-index: 400;
  background: @panel4;
}

.game-option {
  margin-left: 40px;
}

.panel-option {
  //margin-top: 20px;
}
.btn-option {
  margin-top: 20px;
}
.action-option {
  width: 600px;
  margin-top: 20px;

  &-title {
    line-height: 40px;
    font-size: 16px;
    font-weight: 600;
  }

  &-prefix {
    width: 10px;
    color: #f23d3d;
    font-weight: 700;
  }
}
</style>
