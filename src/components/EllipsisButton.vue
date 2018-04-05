<template>
  <button class="ellipsis-button">…</button>
</template>

<style lang="scss">
  .ellipsis-button {
    display: inline-block;
    height: 12px;
    margin-left: 5px;
    padding: 0 5px 5px;

    vertical-align: middle;

    border: 0;
    border-radius: 1px;

    color: #555;

    font-size: 12px;
    font-weight: bold;
    line-height: 6px;

    background: rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }
</style>
