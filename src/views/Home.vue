<template>
  <div class="home">
    <select
      name="processes"
      id="processesList"
      v-model="selectedProcessId"
    >
      <option
        v-for="(process, i) in processes"
        :key="i"
        :value="process['ows:Identifier']._text"
      >{{ process['ows:Title']._text }}</option>
    </select>
    <div
      class="processDescription"
      v-if="selectedProcessData"
    >
      <div class="processDescription__row">
        <p><span>Идентификатор:</span> {{ selectedProcessDescription['ows:Identifier']._text }}</p>
      </div>
      <div class="processDescription__row">
        <p><span>Заголовок:</span> {{ selectedProcessDescription['ows:Title']._text }}</p>
      </div>
      <div class="processDescription__row">
        <p><span>Описание:</span> {{ selectedProcessDescription['ows:Abstract']._text }}</p>
      </div>
      <div class="processDescription__row processDescription__row_inputs">
        <p><span>Инпуты</span></p>
        <pre class="processDescription__json">{{ selectedProcessDescription.DataInputs }}</pre>
      </div>
      <div class="processDescription__row processDescription__row_outputs">
        <p><span>Аутпуты</span></p>
        <pre class="processDescription__json">{{ selectedProcessDescription.ProcessOutputs }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import convert from 'xml-js';
import HTTP from '@/js/HTTP';

export default {
  name: 'home',
  components: {

  },
  data() {
    return {
      processes: [],
      selectedProcessId: null,
      selectedProcessData: null,
    };
  },
  computed: {
    selectedProcessDescription() {
      return this.selectedProcessData['wps:ProcessDescriptions'].ProcessDescription;
    },
  },
  watch: {
    selectedProcessId(processId) {
      if (!processId) return;

      const vi = this;

      HTTP.get('', {
        params: {
          request: 'DescribeProcess',
          identifier: processId,
        },
      })
        .then((response) => {
          vi.selectedProcessData = convert.xml2js(response.data, { compact: true });
        });
    },
  },
  created() {
    HTTP.get('', {
      params: {
        request: 'GetCapabilities',
      },
    })
      .then((response) => {
        const capabilities = convert.xml2js(response.data, { compact: true });
        this.processes = capabilities['wps:Capabilities']['wps:ProcessOfferings']['wps:Process'];
      })
      .catch(err => console.log(err));
  },
};
</script>

<style lang="scss">
  .processDescription {
    text-align: left;

    &__row {
      span {
        font-weight: bold;
      }
    }
  }
</style>
