'use strict'
const chai = require("chai")
const sinon = require("sinon")
const fileSystem = require("../../file-system")

process.env.npm_lifecycle_event = "file-system"
const app = require("../../app")

const assert = chai.assert
sinon.assert.expose(assert, {prefix: ""})

chai.use(require("chai-http"))

afterEach(() => sinon.restore())

describe("app", () => {
  describe("GET /api/todos", () => {
    describe("completedが指定されていない場合", () => {
      it("fetchAll()で取得したToDoの配列を返す", async () => {
        const todos = [
          {id: "a", title: "ネーム", completed: false},
          {id: "b", title: "下書き", completed: true},
        ]
        sinon.stub(fileSystem, "fetchAll").resolves(todos)
        const res = await chai.request(app).get("/api/todos")
        assert.strictEqual(res.status, 200)
        assert.deepEqual(res.body, todos)
      })

      it("fetchAllが失敗したらエラーを返す", async () => {
        sinon.stub(fileSystem, "fetchAll").rejects(new Error("fetchAll() 失敗"))
        const res = await chai.request(app).get("/api/todos")
        assert.strictEqual(res.status, 500)
        assert.deepEqual(res.body, { error: "fetchAll() 失敗"})
      })
    })

    describe("completedが指定されている場合", () => {
      it("completedを引数にfetchByCompleted()を実行し取得したToDoの配列を返す", async () => {
        const todos = [
          {id: "a", title: "ネーム", completed: false},
          {id: "b", title: "下書き", completed: true},
        ]
        sinon.stub(fileSystem, "fetchByCompleted").resolves(todos)

        for (const completed of [true, false]) {
          const res = await chai.request(app)
            .get("/api/todos")
            .query({ completed })
          
          assert.strictEqual(res.status, 200)
          assert.deepEqual(res.body, todos)
          assert.calledWith(fileSystem.fetchByCompleted, completed)
        }
      })

      it("fetchByCompleted()が失敗したらエラーを返す", async () => {
        sinon.stub(fileSystem, "fetchByCompleted").rejects(new Error("fetchByCompleted() 失敗"))
        const res = await chai.request(app)
          .get("/api/todos")
          .query({ completed: true })
        
        assert.strictEqual(res.status, 500)
        assert.deepEqual(res.body, { error: "fetchByCompleted() 失敗"})
      })
    })
  })

  describe("POST /api/todos", () => {
    it("パラメータに指定したタイトルを引数にcreate()を実行し、結果を返す", async () => {
      sinon.stub(fileSystem, "create").resolves()

      const res = await chai.request(app)
        .post("/api/todos")
        .send({ title: "ネーム"})

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.title, "ネーム")
      assert.strictEqual(res.body.completed, false)
      assert.calledWith(fileSystem.create, res.body)
    })

    it("パラメータにタイトルが指定されていない場合、404エラーを返す", async () => {
      sinon.spy(fileSystem, "create")
      for (const title of ["", undefined]) {
        const res = await chai.request(app)
          .post("/api/todos")
          .send({ title })
        
        assert.strictEqual(res.status, 400)
        assert.deepEqual(res.body, { error: "title is required" })
        assert.notCalled(fileSystem.create)
      }
    })

    it("create()が失敗したらエラーを返す", async () => {
      sinon.stub(fileSystem, "create").rejects(new Error("create() 失敗"))

      const res = await chai.request(app)
        .post("/api/todos")
        .send({ title: "ネーム"})
      
      assert.strictEqual(res.status, 500)
      assert.deepEqual(res.body, { error: "create() 失敗"})
    })
  })
})