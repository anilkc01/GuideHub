const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const PlanMock = dbMock.define('Plan',{
 id:1,
 title:"Test Plan",
 price:"100",
 location:"Nepal"
});

const mockRes = ()=>{
 const res={}
 res.status=jest.fn().mockReturnValue(res)
 res.json=jest.fn().mockReturnValue(res)
 return res
}

const createPlan = async(req,res)=>{
 try{

  const {title,price,location}=req.body

  if(!title || !price){
   return res.status(400).json({message:"Required fields missing"})
  }

  const plan = await PlanMock.create({title,price,location})

  res.status(201).json({success:true,data:plan})

 }catch(err){
  res.status(500).json({message:err.message})
 }
}

const getPlans = async(req,res)=>{
 try{

  const plans = await PlanMock.findAll()

  res.status(200).json({success:true,data:plans})

 }catch(err){
  res.status(500).json({message:err.message})
 }
}

describe("Plans Controller Tests",()=>{

test("Case 17 create plan success",async()=>{
 const req={body:{title:"Everest",price:"500",location:"Nepal"}}
 const res=mockRes()

 await createPlan(req,res)

 expect(res.status).toHaveBeenCalledWith(201)
})

test("Case 18 missing fields",async()=>{
 const req={body:{}}
 const res=mockRes()

 await createPlan(req,res)

 expect(res.status).toHaveBeenCalledWith(400)
})

test("Case 19 create method called",async()=>{
 const req={body:{title:"A",price:"100"}}
 const res=mockRes()

 const spy=jest.spyOn(PlanMock,'create')

 await createPlan(req,res)

 expect(spy).toHaveBeenCalled()
})

test("Case 20 response json called",async()=>{
 const req={body:{title:"A",price:"100"}}
 const res=mockRes()

 await createPlan(req,res)

 expect(res.json).toHaveBeenCalled()
})

test("Case 21 get plans success",async()=>{
 const req={}
 const res=mockRes()

 await getPlans(req,res)

 expect(res.status).toHaveBeenCalledWith(200)
})

test("Case 22 findAll called",async()=>{
 const req={}
 const res=mockRes()

 const spy=jest.spyOn(PlanMock,'findAll')

 await getPlans(req,res)

 expect(spy).toHaveBeenCalled()
})

test("Case 23 db error handling",async()=>{
 const req={}
 const res=mockRes()

 PlanMock.findAll=jest.fn().mockRejectedValue(new Error())

 await getPlans(req,res)

 expect(res.status).toHaveBeenCalledWith(500)
})

test("Case 24 response structure",async()=>{
 const req={}
 const res=mockRes()

 await getPlans(req,res)

 expect(res.status).toHaveBeenCalled()
})

})