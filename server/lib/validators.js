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
    body("bio", "Please Enter Bio").notEmpty(),
    body("password", "Please Enter Password").notEmpty(),
];

const updateProfileValidator  = ()=>[
    body("name", "Please Enter Name").notEmpty(),
    body("username", "Please Enter UserName").notEmpty(),
    body("bio", "Please Enter Bio").notEmpty(),
];

const loginValidator = ()=>[
    body("username", "Please Enter UserName").notEmpty(),
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


export {registerValidator, validateHandler, loginValidator, newGroupValidator, addMembersValidator, removeMemberValidator, leaveGroupValidator, sendAttachmentsValidator, chtIdValidator, renameGroupValidator, sendRequestValidator, acceptRequestValidator, adminLoginValidator, updateProfileValidator};