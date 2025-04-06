import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

// Swagger定义
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'JobTrip 职途助手 API',
    version,
    description: '职途助手后端API文档 - 提供求职管理、数据同步和用户信息管理等功能',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
    contact: {
      name: '404 Not Found 团队',
      url: 'https://github.com/UOA-CS732-S1-2025/group-project-404-not-found/tree/dev',
      email: 'contact@example.com'
    },
    'x-logo': {
      url: 'https://cs732.uoa.anhydrous.dev/images/Dall-E/404%20Not%20Found.png',
      altText: 'JobTrip Logo'
    }
  },
  servers: [
    {
      url: '/api/v1',
      description: '开发服务器',
    },
    {
      url: 'https://jobtrip-api.example.com/api/v1',
      description: '生产服务器',
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // 统一响应格式
      ApiResponse: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            description: '状态码，0或200表示成功，非0或4xx/5xx表示错误',
            example: 200
          },
          message: {
            type: 'string',
            description: '返回的信息，通常是错误描述或成功提示',
            example: '操作成功'
          },
          data: {
            type: 'object',
            description: '返回的具体数据',
            nullable: true
          },
          timestamp: {
            type: 'integer',
            description: '返回时间戳',
            example: 1629789258000
          },
          traceId: {
            type: 'string',
            description: '请求追踪ID（可选）',
            example: '1629789258000-abc123'
          }
        }
      },
      
      // 分页响应格式
      PaginationResponse: {
        type: 'object',
        properties: {
          total: {
            type: 'integer',
            description: '总数据条数',
            example: 100
          },
          page: {
            type: 'integer',
            description: '当前页码',
            example: 1
          },
          size: {
            type: 'integer',
            description: '每页数量',
            example: 10
          },
          data: {
            type: 'array',
            description: '列表数据',
            items: {
              type: 'object'
            }
          },
          totalPages: {
            type: 'integer',
            description: '总页数',
            example: 10
          }
        }
      },
      
      // 用户相关模型
      UserPreferences: {
        type: 'object',
        properties: {
          theme: {
            type: 'string',
            enum: ['light', 'dark', 'system'],
            default: 'light',
          },
          notifications: {
            type: 'boolean',
            default: true,
          },
          language: {
            type: 'string',
            enum: ['zh-CN', 'en-US'],
            default: 'zh-CN',
          },
        },
      },
      User: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          _id: {
            type: 'string',
            description: '用户ID',
          },
          username: {
            type: 'string',
            description: '用户名',
          },
          email: {
            type: 'string',
            format: 'email',
            description: '邮箱',
          },
          password: {
            type: 'string',
            format: 'password',
            description: '密码',
            minLength: 8,
          },
          firstName: {
            type: 'string',
            description: '名',
          },
          lastName: {
            type: 'string',
            description: '姓',
          },
          preferences: {
            $ref: '#/components/schemas/UserPreferences',
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'suspended'],
            default: 'active',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      UserResponse: {
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/ApiResponse'
          },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
                    description: '认证令牌'
                  },
                  user: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                      username: {
                        type: 'string',
                      },
                      email: {
                        type: 'string',
                      },
                      firstName: {
                        type: 'string',
                      },
                      lastName: {
                        type: 'string',
                      },
                      preferences: {
                        $ref: '#/components/schemas/UserPreferences',
                      },
                      status: {
                        type: 'string',
                      },
                    },
                  }
                }
              }
            }
          }
        ]
      },
      
      // 职位相关模型
      Job: {
        type: 'object',
        required: ['platform', 'title', 'company', 'location', 'source', 'sourceId', 'sourceUrl'],
        properties: {
          _id: {
            type: 'string',
            description: '职位ID',
          },
          platform: {
            type: 'string',
            description: '求职平台名称',
          },
          title: {
            type: 'string',
            description: '职位标题',
          },
          company: {
            type: 'string',
            description: '公司名称',
          },
          location: {
            type: 'string',
            description: '工作地点',
          },
          description: {
            type: 'string',
            description: '职位描述',
          },
          requirements: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: '职位要求',
          },
          salary: {
            type: 'string',
            description: '薪资范围',
          },
          jobType: {
            type: 'string',
            enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
            default: 'full-time',
            description: '工作类型',
          },
          status: {
            type: 'string',
            enum: ['new', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn', 'closed'],
            default: 'new',
            description: '职位状态',
          },
          source: {
            type: 'string',
            enum: ['linkedin', 'seek', 'indeed', 'manual', 'other'],
            description: '数据来源',
          },
          sourceId: {
            type: 'string',
            description: '平台职位原始ID',
          },
          sourceUrl: {
            type: 'string',
            description: '原始链接',
          },
          appliedDate: {
            type: 'string',
            format: 'date-time',
            description: '申请日期',
          },
          deadline: {
            type: 'string',
            format: 'date-time',
            description: '截止日期',
          },
          notes: {
            type: 'string',
            description: '备注',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      JobResponse: {
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/ApiResponse'
          },
          {
            properties: {
              data: {
                $ref: '#/components/schemas/Job'
              }
            }
          }
        ]
      },
      JobListResponse: {
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/ApiResponse'
          },
          {
            properties: {
              data: {
                $ref: '#/components/schemas/PaginationResponse',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Job'
                    }
                  }
                }
              }
            }
          }
        ]
      },
      
      // 公司相关模型
      Company: {
        type: 'object',
        required: ['name'],
        properties: {
          _id: {
            type: 'string',
            description: '公司ID',
          },
          name: {
            type: 'string',
            description: '公司名称',
          },
          website: {
            type: 'string',
            description: '公司网站',
          },
          industry: {
            type: 'string',
            description: '行业',
          },
          size: {
            type: 'string',
            enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
            description: '公司规模',
          },
          location: {
            type: 'string',
            description: '公司地点',
          },
          description: {
            type: 'string',
            description: '公司描述',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      CompanyResponse: {
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/ApiResponse'
          },
          {
            properties: {
              data: {
                $ref: '#/components/schemas/Company'
              }
            }
          }
        ]
      },
      CompanyListResponse: {
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/ApiResponse'
          },
          {
            properties: {
              data: {
                $ref: '#/components/schemas/PaginationResponse',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Company'
                    }
                  }
                }
              }
            }
          }
        ]
      },
      
      // 用户-职位关联模型
      UserJob: {
        type: 'object',
        required: ['userId', 'jobId'],
        properties: {
          _id: {
            type: 'string',
            description: '关联ID',
          },
          userId: {
            type: 'string',
            description: '用户ID',
          },
          jobId: {
            type: 'string',
            description: '职位ID',
          },
          status: {
            type: 'string',
            enum: ['new', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn', 'closed'],
            default: 'new',
            description: '申请状态',
          },
          isFavorite: {
            type: 'boolean',
            default: false,
            description: '是否收藏',
          },
          customTags: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: '自定义标签',
          },
          notes: {
            type: 'string',
            description: '备注',
          },
          reminderDate: {
            type: 'string',
            format: 'date-time',
            description: '提醒日期',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      UserJobResponse: {
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/ApiResponse'
          },
          {
            properties: {
              data: {
                $ref: '#/components/schemas/UserJob'
              }
            }
          }
        ]
      },
      UserJobListResponse: {
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/ApiResponse'
          },
          {
            properties: {
              data: {
                $ref: '#/components/schemas/PaginationResponse',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/UserJob'
                    }
                  }
                }
              }
            }
          }
        ]
      },
      
      // 错误响应模型
      ErrorResponse: {
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/ApiResponse'
          },
          {
            properties: {
              code: {
                type: 'integer',
                example: 400
              },
              message: {
                type: 'string',
                example: '错误信息'
              },
              data: {
                type: 'object',
                nullable: true,
                example: null
              }
            }
          }
        ]
      },
    },
    responses: {
      UnauthorizedError: {
        description: '未授权，需要有效的令牌',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              code: 401,
              message: '您未登录，请先登录',
              data: null,
              timestamp: 1629789258000,
              traceId: '1629789258000-abc123'
            },
          },
        },
      },
      ForbiddenError: {
        description: '无权限访问',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              code: 403,
              message: '无权访问此资源',
              data: null,
              timestamp: 1629789258000,
              traceId: '1629789258000-abc123'
            },
          },
        },
      },
      NotFoundError: {
        description: '资源未找到',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              code: 404,
              message: '未找到请求的资源',
              data: null,
              timestamp: 1629789258000,
              traceId: '1629789258000-abc123'
            },
          },
        },
      },
      ValidationError: {
        description: '验证错误',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              code: 400,
              message: '提供的数据无效',
              data: null,
              timestamp: 1629789258000,
              traceId: '1629789258000-abc123'
            },
          },
        },
      },
      ServerError: {
        description: '服务器错误',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              code: 500,
              message: '服务器内部错误',
              data: null,
              timestamp: 1629789258000,
              traceId: '1629789258000-abc123'
            },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Swagger选项
const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

// 初始化Swagger规范
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec; 