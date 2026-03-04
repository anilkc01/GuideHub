const SequelizeMock = require('sequelize-mock')
const dbMock = new SequelizeMock()

const BlogMock = dbMock.define('Blog',{
 id:1,
 title:"test",
 content:"hello"
})

const mockRes = ()=>{
 const res={}
 res.status=jest.fn().mockReturnValue(res)
 res.json=jest.fn().mockReturnValue(res)
 return res
}

const createBlog = async(req,res)=>{
 try{

  const {title,content}=req.body

  if(!title || !content){
   return res.status(400).json({message:"required"})
  }

  const blog = await BlogMock.create({title,content})

  res.status(201).json({data:blog})

 }catch(err){
  res.status(500).json({message:err.message})
 }
}

describe("Blog Controller Tests",()=>{

test("Case 9 create blog success",async()=>{
 const req={body:{title:"t",content:"c"}}
 const res=mockRes()

 await createBlog(req,res)

 expect(res.status).toHaveBeenCalledWith(201)
})

test("Case 10 missing fields",async()=>{
 const req={body:{}}
 const res=mockRes()

 await createBlog(req,res)

 expect(res.status).toHaveBeenCalledWith(400)
})

test("Case 11 create called",async()=>{
 const req={body:{title:"t",content:"c"}}
 const res=mockRes()

 const spy=jest.spyOn(BlogMock,'create')

 await createBlog(req,res)

 expect(spy).toHaveBeenCalled()
})

test("Case 12 json called",async()=>{
 const req={body:{title:"t",content:"c"}}
 const res=mockRes()

 await createBlog(req,res)

 expect(res.json).toHaveBeenCalled()
})

test("Case 13 status called",async()=>{
 const req={body:{title:"t",content:"c"}}
 const res=mockRes()

 await createBlog(req,res)

 expect(res.status).toHaveBeenCalled()
})

test("Case 14 db error",async()=>{
 const req={body:{title:"t",content:"c"}}
 const res=mockRes()

 BlogMock.create=jest.fn().mockRejectedValue(new Error())

 await createBlog(req,res)

 expect(res.status).toHaveBeenCalledWith(500)
})

test("Case 15 response object used",async()=>{
 const req={body:{title:"t",content:"c"}}
 const res=mockRes()

 await createBlog(req,res)

 expect(res.json).toHaveBeenCalledTimes(1)
})

test("Case 16 correct structure",async()=>{
 const req={body:{title:"t",content:"c"}}
 const res=mockRes()

 await createBlog(req,res)

 expect(res.status).toHaveBeenCalled()
})

})