import { body, validationResult, param, check } from 'express-validator';
import { ErrorHandler } from '../utils/utitlity.js';
import User from '../models/user.js';

const validateHandler = (req, res, next)=>{
        const errors = validationResult(req);

        const errorMessages = errors
        .array()
        .map(error=>error.msg)
        .join(", ");

        if(errors.isEmpty())return next();
        else next (new ErrorHandler(errorMessages, 400));

}

const registerValidator  = ()=>[
    body("name", "Please Enter Name").notEmpty(),
    body("username", "Please Enter UserName").notEmpty(),
    body('username').custom(async value => {
        const existingUser = await User.find({username: value.toLowerCase()});
        if (existingUser.length !== 0) {

          throw new ErrorHandler('This username is already taken, Please try different username', 400);
        }
      }),
    body("email", "Please Enter Email").notEmpty(),
    body("email").custom(async value => {
        const existingUser = await User.find({email: value.toLowerCase()});
        if (existingUser.length !== 0) {

          throw new ErrorHandler('The user from this email already exists, Please try different email', 400);
        }
      }),
    body("bio", "Please Enter Bio").notEmpty(),
    body("password").isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

const updateProfileValidator  = ()=>[
    body("name", "Please Enter Name").notEmpty(),
    body("username", "Please Enter UserName").notEmpty(),
    body("bio", "Please Enter Bio").notEmpty(),
];

const loginValidator = ()=>[
    body("email", "Please Enter Email").notEmpty(),
    body("password", "Please Enter Password").notEmpty()
];

const newGroupValidator = ()=>[
    body("name", "Please Enter Group Name").notEmpty(),
    body("members").isArray({min: 2, max: 100}).withMessage("Members must be between 2 and 100")
    .notEmpty().withMessage("Please Enter members"),
];

const addMembersValidator = ()=>[
    body("chatId", "Please Enter Chat ID").notEmpty(),
    body("members")
    .isArray({min: 1, max: 97}).withMessage("Members must be between 1 and 97")
    .notEmpty().withMessage("Please Enter members"),
];

const removeMemberValidator = ()=>[
    body("chatId", "Please Enter Chat ID").notEmpty(),
    body("userId", "Please Enter User ID").notEmpty(),
];
const updatePasswordValidator = ()=>[
    body("oldPassword", "Please Enter Old Password").notEmpty(),
    body("newPassword").isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

const leaveGroupValidator = ()=>[
    param("id", "Please Enter Chat ID").notEmpty(),
];

const sendAttachmentsValidator = ()=>[
    body("chatId", "Please Enter Chat ID").notEmpty()
];

const chtIdValidator = ()=>[
    param("id", "Please Enter Chat ID").notEmpty(),
];

const renameGroupValidator = ()=>[
    param("id", "Please Enter Chat ID").notEmpty(),
    body("name", "Please Enter Group Name").notEmpty(),
];

const sendRequestValidator = ()=>[
    body("userId", "Please Enter User ID").notEmpty(),
];

const acceptRequestValidator = ()=>[
    body("requestId", "Please Enter Request ID").notEmpty(),
    body("accept")
    .notEmpty().withMessage("Please Select Accept")
    .isBoolean().withMessage("Accept must be a boolean"),
];

const adminLoginValidator = ()=>[
    body("secretKey", "Please Enter Secret Key").notEmpty()
]


export {
    registerValidator,
    validateHandler, 
    loginValidator, 
    newGroupValidator, 
    addMembersValidator, 
    removeMemberValidator, 
    leaveGroupValidator, 
    sendAttachmentsValidator, 
    chtIdValidator, 
    renameGroupValidator, 
    sendRequestValidator, 
    acceptRequestValidator, 
    adminLoginValidator, 
    updateProfileValidator,
    updatePasswordValidator,
};