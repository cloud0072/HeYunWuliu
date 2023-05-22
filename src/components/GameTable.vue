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
          <a-form-item>
            <template #label>
              <div class="item-label">
                <div class="action-option-prefix"></div>
                当前位置
              </div>
            </template>
            <a-row :gutter="8">
              <a-col span="6">
                <a-select
                    @select="e => onSelect('circle1', e)"
                    :value="table.circle1 % 360"
                    :options="degOptions.filter((v,i)=> i>4)"
                    placeholder="请选择转动角度-外圈"
                />
              </a-col>
              <a-col span="6">
                <a-select
                    @select="e => onSelect('circle2', e)"
                    :value="table.circle2 % 360"
                    :options="degOptions.filter((v,i)=> i>4)"
                    placeholder="请选择转动角度-中圈"
                />
              </a-col>
              <a-col span="6">
                <a-select
                    @select="e => onSelect('circle3', e)"
                    :value="table.circle3 % 360"
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
                <div class="item-label">
                  <div class="action-option-prefix">
                    <right-circle-outlined v-if="actionIndex === index"/>
                  </div>
                  {{ item.name }}
                </div>
              </template>
              <a-row :gutter="8">
                <a-col span="6">
                  <a-select
                      v-model:value="item.circle1"
                      :options="degOptions"
                      placeholder="请选择转动角度-外圈"
                  />
                </a-col>
                <a-col span="6">
                  <a-select
                      v-model:value="item.circle2"
                      :options="degOptions"
                      placeholder="请选择转动角度-中圈"
                  />
                </a-col>
                <a-col span="6">
                  <a-select
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
        <div class="action-option-title">推荐解法</div>
        <div class="action-resolve-list">
          <div v-if="solution.length === 0"> 当前情况下无解</div>
          <div class="action-item" v-for="(item, i) in solution" :key="i">
            {{ actions[i].name }}: {{ item }} 次
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, ref, toRefs, watch} from "vue";
import {DeleteOutlined, PlusOutlined, RightCircleOutlined} from '@ant-design/icons-vue';

export default {
  name: "GameTable",
  components: {
    PlusOutlined,
    DeleteOutlined,
    RightCircleOutlined
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
      solution: []
    })

    const onSelect = (key, e) => {
      console.log('on select', e)
      state.table[key] = e
    }

    // 动作列表
    const actions = ref([
      {name: 'Action1', circle1: 60, circle2: 0, circle3: 0},
      {name: 'Action2', circle1: 0, circle2: 60, circle3: 0},
      {name: 'Action3', circle1: 0, circle2: 0, circle3: 60},
    ])

    watch(actions.value, nv => {
      console.log('actions.value', nv)
      resolveAction()
    });

    watch(state.table, nv => {
      console.log('state.table', nv)
      resolveAction()
    }, {
      deep: true
    })

    const autoIncrement = ref(actions.value.length + 1);

    const degOptions = [...new Array(11).keys()].map((v, i) => {
      const n = -300 + i * 60;
      return {label: n + '°', value: n}
    })

    const handleAdd = () => {
      actions.value.push({name: 'Action' + autoIncrement.value++, circle1: 0, circle2: 0, circle3: 0})
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
      state.table.circle1 = (circle1 + action.circle1);
      state.table.circle2 = (circle2 + action.circle2);
      state.table.circle3 = (circle3 + action.circle3);
    }

    // 求解
    // 1 求解时 Action的先后次序不影响结果，求取最优解时 设最优解需要0-X步，枚举X步有多少种不同的Action组合，无解则X+1，有解则返回
    // 2 若 位置 % 360 = 0 则为正确位置
    const resolveAction = () => {
      try {
        state.solution = []
        // 尝试 50 次
        getSolutions(actions.value.length, 50);
      } catch (error) {
        const result = JSON.parse(error.message);
        state.solution = result;
        console.log('result:', result)
      }
    }

    /**
     * actions种操作, 转动times次, 有多少种不通转动方式
     * acions = 3 时
     * times = 0
     * [
     *  [0,0,0]
     * ]
     * times = 1
     * [
     *  [1,0,0],
     *  [0,1,0],
     *  [0,0,1]
     * ]
     * times = 2
     * [
     *  [2,0,0],
     *  [1,1,0],
     *  [0,1,2],
     *
     *  [1,1,0],
     *  [0,2,0],
     *  [0,1,1],
     *
     *  [1,0,1]
     *  [0,2,1]
     *  [0,0,2]
     * ]
     */
    const getSolutions = (len = 0, times) => {
      if (times >= 1) {
        const actionList = getSolutions(len, times - 1);
        const set = new Set(); // 去重
        for (let i = 0; i < actionList.length; i++) {
          for (let j = 0; j < actionList[i].length; j++) {
            const list = [...actionList[i]];
            list[j] = list[j] + 1
            if (validSolution(list)) {
              throw new Error(JSON.stringify(list))
            }
            set.add(JSON.stringify(list))
          }
        }
        const result = [...set].map(s => JSON.parse(s));
        // console.log(`len: ${len} times: ${times}`, result);
        console.log(`len: ${len} times: ${times}`);
        return result;
      }
      // init
      const list = new Array(len).fill(0);
      if (validSolution(list)) {
        throw new Error(JSON.stringify(list))
      }
      return [list];
    }

    const validSolution = (array) => {
      // 获取初始状态
      const {circle1, circle2, circle3} = state.table;
      const initState = {circle1, circle2, circle3};
      return Object.keys(initState)
          .map(key => initState[key] + array.map((t, i) => actions.value[i][key] * t).reduce((pv, cv) => pv + cv, 0))
          .filter(deg => deg % 360 === 0).length === 3
    }

    // create
    resolveAction()

    return {
      ...toRefs(state),
      actions,
      degOptions,
      onSelect,
      applyAction,
      switchAction,
      isActive,
      handleAdd,
      handleDelete,
      resolveAction
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
  width: calc(2 * @width - 10px);
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
    margin-right: 4px;
    line-height: 32px;
    color: #f23d3d;
    font-weight: 700;
    text-align: center;
  }
}
.item-label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 72px;
}
.game-resolve {
  margin-left: 40px;
}
</style>
