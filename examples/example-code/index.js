// const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./', true, /\.code$/)
// requireAll(req)

export default req
