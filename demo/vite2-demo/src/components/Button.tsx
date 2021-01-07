import { defineComponent } from 'vue'
import { Progress } from 'vant'

export default defineComponent({
  setup() {
    return () => {
      return (<Progress percentage={3} />)
    }
  }
})