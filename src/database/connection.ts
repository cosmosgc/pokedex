import knex from 'knex'
import knexconfig from '../../knexfile'

const config = process.env.NODE_ENV === 'test' ? knexconfig.test : knexconfig.development

const connection = knex(config)

export default connection