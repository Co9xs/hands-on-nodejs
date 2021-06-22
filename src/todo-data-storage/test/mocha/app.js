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
