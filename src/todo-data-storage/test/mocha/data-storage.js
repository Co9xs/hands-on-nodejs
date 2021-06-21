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
    describe("fetchByCompleted()", () => {
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

    // update
    describe("update()", () => {
      const todo1 = { id: "a", title: "ネーム", completed: false }
      const todo2 = { id: "b", title: "下書き", completed: false }

      beforeEach(async () => {
        await create(todo1)
        await create(todo2)
      })

      it("指定したIDのTodoを更新し、更新後のTodoを返す", async () => {
        assert.deepEqual(
          await update("a", { completed: true }), 
          { id: "a", title: "ネーム", completed: true }
        )
        assert.deepEqual(
          await fetchByCompleted(true),
          [{ id: "a", title: "ネーム", completed: true }]
        )
        assert.deepEqual(
          await fetchByCompleted(false), 
          [todo2]
        )

        assert.deepEqual(
          await update("b", { title: "ペン入れ" }),
          { id: "b", title: "ペン入れ", completed: false }
        )
        assert.deepEqual(
          await fetchByCompleted(true),
          [{ id: "a", title: "ネーム", completed: true }]
        )
        assert.deepEqual(
          await fetchByCompleted(false),
          [{ id: "b", title: "ペン入れ", completed: false }]
        )
      })

      it("存在しないIDを指定するとnullを返す", async () => {
        assert.isNull(await update("c", { completed: true }))
        assert.deepEqual(await fetchByCompleted(true), [])
        assert.sameDeepMembers(await fetchByCompleted(false), [todo1, todo2])
      })
    })

    // remove
    describe("remove()", () => {
      const todo1 = { id: "a", title: "ネーム", completed: false }
      const todo2 = { id: "b", title: "下書き", completed: false }

      beforeEach(async () => {
        await create(todo1)
        await create(todo2)
      })

      it("指定したIDのTodoを削除する", async () => {
        assert.strictEqual(await remove("b"), "b")
        assert.deepEqual(await fetchAll(), [todo1])
      })

      it("存在しないIDを指定するとnullを返す", async () => {
        assert.strictEqual(await remove("c"), null)
        assert.sameDeepMembers(await fetchAll(), [todo1, todo2])
      })
    })
  })
}