import express from 'express'
import con from '../utils/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import multer from 'multer';
import path from 'path';

//router.use(express.json());
const router = express.Router();



router.post("/adminlogin", (req, res) => {
    const sql = "SELECT * from admin where email = ? and password = ?"
    con.query(sql,[req.body.email, req.body.password], (err, result) => {
        if(err)
         return res.json({loginStatus: false, Error: "Query error"});
        if(result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign(
                {role: "admin", eamil: email } , 
                "jwt_secret_key", 
                {expiresIn: "1d"}
                );
                res.cookie('token', token)
                return res.json({loginStatus: true });
        }       else {
            return res.json({loginStatus: false, Error: "Wrong Email or Password"})
        }
    });
});


///////////      Category    //////

router.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if(err) 
        return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})


////        Add Category         ////

router.post('/add_category', (req, res) => {
    // res.send(req.body)
    const sql = `INSERT INTO category(name) VALUE('${req.body.category}')`
    con.query(sql, (err, result) => {
        if(err) 
        return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

/////////////       Add Employee        ///////////

/// image upload

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file ,cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})

/// end image upload

router.post('/add_employee',upload.single('image'), (req, res) => {
    try{
        const sql = `INSERT INTO employee SET ?`

        bcrypt.hash(req.body.password.toString(), 10, (err, hash)=>{
            if(err) return res.json({Error:"Error in hashing password"})

            const data = {
                eid:req.body.eid,
                name:req.body.name,
                email:req.body.email,
                password:hash,
                salary:req.body.salary,
                address:req.body.address,
                image:req.file.fieldname,
                category_id:req.body.category_id
            }
            con.query(sql, data, (err, result)=>{
                if(err){
                    console.log("Admin Data not Post")
                    res.json(err)
                }else{
                    console.log("Admin Data Post SuccessFully....")
                    res.json(result)
                }
            })


        })
    }catch(err){

    }
    
})


router.get('/employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

////////    Edit employee   ////////

router.get('/employee/:eid', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/editEmployee/:eid', (req, res) => {
    const eid = req.params.eid;
    console.log(req.body, eid)
    const sql = `UPDATE employee set name= ?, email= ?, salary= ?, address= ?, category_id = ? Where eid= ${eid}`
        const values = [
            req.body.name,
            req.body.email,
            req.body.salary,
            req.body.address,
            req.body.category_id
        ]
    con.query(sql, values, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


////            Delete Api          /////

router.delete('/delete_employee/:eid', (req, res) => {
    const eid = req.params.eid;
    const sql = "delete from employee where eid = ?"
    con.query(sql, [eid], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result:result})
    })
})

////////////        Admin Count         ////////

router.get('/admin_count', (req, res) => {
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

////////        Employee Count      /////////

router.get('/employee_count', (req, res) => {
    const sql = "select count(eid) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

/////       Salary count        ////////

router.get('/salary_count', (req, res) => {
    const sql = "select sum(salary) as salary from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


/////       List of Admin       /////

router.get('/adminRecords', (req, res) => {
    const sql = "select * from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


//////      Admin Logout         //////

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

export {router as adminRouter}