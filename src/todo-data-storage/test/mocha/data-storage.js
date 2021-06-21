"use strict"
const { assert } = require("chai")
for (const dataStorageName of ["file-system", "sqlite"]) {
  const { fetchAll, fetchByCompleted, create, update, remove } = require(`../../${dataStorageName}`)
  describe(dataStorageName, () => {
    beforeEach(async () => {
      const allTodos = await fetchAll()
      await Promise.all(allTodos.map(({id}) => remove(id)))
    })

    // create, fetchAll
    describe("create(), fetchAll()", () => {
      it("create()で作成したTODOをfetchAllで取得できる", async () => {
        assert.deepEqual(await fetchAll(), [])
        const todo1 = { id: "a", title: "ネーム", completed: false }
        await create(todo1)
        assert.deepEqual(await fetchAll(), [todo1])
  
        const todo2 = { id: "b", title: "下書き", completed: true }
        await create(todo2)
        const todo3 = { id: "c", title: "ペン入れ", completed: false }
        await create(todo3)
  
        assert.sameDeepMembers(await fetchAll(), [todo1, todo2, todo3])
      })
    })

    // fetchByCompleted
    describe("fetchByCompleted", () => {
      it("completedの値が引数で指定したものと等しいTodoだけを取得できる", async () => {
        assert.deepEqual(await fetchAll(), [])
        assert.deepEqual(await fetchByCompleted(true), [])
        assert.deepEqual(await fetchByCompleted(false), [])

        const todo1 = { id: "a", title: "ネーム", completed: false }
        await create(todo1)
        const todo2 = { id: "b", title: "下書き", completed: true }
        await create(todo2)
        const todo3 = { id: "c", title: "ペン入れ", completed: false }
        await create(todo3)
        assert.deepEqual(await fetchByCompleted(true), [todo2])
        assert.sameDeepMembers(await fetchByCompleted(false), [todo1, todo3])
      })
    })

  })
}