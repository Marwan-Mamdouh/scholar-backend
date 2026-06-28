import db from "../../db/db_config.js"
import type { PaginationQuery } from "../../middlewares/pagination.js";
import type { domainSchema , domain, domainFilter, subCategory, subCategoryFilter, publication, publicationID, publicationPatch, publicationMetrics, publicationMetricsID, publicationMetricsPatch } from "./publication.schema.js";

const publicationService = {
    async addDomain( doaminData: domain ){
        try {
            const newDomain = await db
                .publicationDomain
                .create({data: doaminData });
            return newDomain;
        } catch (error) {
            if (error) {
                console.error("PublicationDomain DB Error:", error.message);
                throw new Error("error adding Publication Domain.");
            }
        }
    },

    async getAllDomains(){
        try {
            const allDomains = await db
                .publicationDomain
                .findMany({
                    include:{subCategories:true}
                });
            console.log("Publication Domains:", allDomains);
            return allDomains || [];
        } catch (error) {
            if (error) throw error;
        }
    },

    async removeDomain( doaminData: domainFilter ){
        try {
            const removedDomain = await db
                .publicationDomain
                .delete({
                    where:{id:doaminData.id}
                })            
        } catch (error) {
            if (error) {
                console.error("PublicationDomain DB Error:", error.message);
                throw new Error("error removing Publication Domain.");
            }
        }

    },


    async addSubCategory( subCategoryData: subCategory ){
        try {
            const found = await db
                .publicationDomain
                .findUnique({
                    where:{id:subCategoryData.domainId}
                })
    
            if (!found) {
                console.error("Invalid data Error:", "domainId isn't found in db");
                throw new Error("Error adding Publication subCategory: domainId not found.");
            }
            
            const newSubcategory = await db
                .publicationSubCategory
                .create({data:subCategoryData})
            return newSubcategory;
        } catch (error) {
            if (error) {
                console.error("publicationSubcategories DB Error:", error.message);
                throw new Error("error adding Publication subCategory.");
            }
        }    
    },

    async getAllSubcategories(){
        try {
            const allSubcategories = await db
                .publicationSubCategory
                .findMany({
                    include:{domain: true}
                })
                console.log("publication Subcategories:", allSubcategories);
                return allSubcategories || [];
        } catch (error) {
            if (error) throw error;
        }
    },


    async removesubCategory( subCategoryData: subCategoryFilter ){
        try {
            const removedSubCategory = await db
                .publicationSubCategory
                .delete({where:{id:subCategoryData.id}})
        } catch (error) {
            if (error) {
                console.error("publicationSubcategories DB Error:", error.message);
                throw new Error("error removing Publication subCategory.");
            }         
        }
    },

    async addPublication( publicationData: publication ){
        try {
            const found = await db
                .publicationSubCategory
                .findUnique({
                    where:{id:publicationData.subCategoryId}
                })
            
            if (!found) {
                console.error("Invalid data Error:", "subCategory isn't found in db");
                throw new Error("Error adding Publication: subCategory not found.");
            }
    
            const newPublication = await db
                .academicPublication
                .create({data:publicationData})
            return newPublication;
        } catch (error) {
            if (error) {
                console.error("academicPublications DB Error:", error.message);
                throw new Error("error adding Publication.");
            }            
        }    
    },
    
    async getAllPublication(){
        try {
            const allPublication = await db
                .academicPublication
                .findMany({
                    include:{
                        yearlyMetrics:true,
                        subCategory:{
                            include:{
                                domain:true
                            }
                        }
                    }
                })
                console.log("publications:", allPublication);
                return allPublication || [];
        } catch (error) {
            if (error) throw error;
        }
    },

    async getPublication(publicationData:publicationID){
        try {
            const publication = await db
                .academicPublication
                .findUnique({
                    where:{id:publicationData.id},
                    include:{
                        yearlyMetrics:true,
                        subCategory:{
                            include:{
                                domain:true
                            }
                        }
                    }
                })
            console.log("publications:", publication);
            return publication || {};
        } catch (error) {
            if (error) throw error;
        }
    },

    async patchPublication( publicationData: publicationPatch ){
        try {
            if(publicationData.subCategoryId){
                const found = await db
                    .publicationSubCategory
                    .findUnique({
                        where:{id:publicationData.subCategoryId}
                    })
                
                if (!found) {
                    console.error("Invalid data Error:", "subCategory isn't found in db");
                    throw new Error("Error adding Publication: subCategory not found.");
                }
            }
            const patchedPublication = await db
                .academicPublication
                .update({
                    where:{id:publicationData.id},
                    data:publicationData
                })
            return patchedPublication;
        } catch (error) {
            if (error) {
                console.error("academicPublications DB Error:", error.message);
                throw new Error("error adding Publication.");
            }            
        }    
    },
    
    async removePublication( publicationData: publicationID ){
        try {
            const removedPublication = await db.$transaction([
                db.publicationYearlyMetric
                    .deleteMany({
                        where:{publicationId:publicationData.id}
                    }),
                db.academicPublication
                    .delete({
                        where:{id:publicationData.id}
                    })            
            ])
        } catch (error) {
            if (error) {
                console.error("Publication DB Error:", error.message);
                throw new Error("error removing Publication.");
            }
        }
    },
//! ////////////////////////////
    async addMetrics( metricsData: publicationMetrics ){
        try {
            const found = await db
                .academicPublication
                .findUnique({
                    where:{id:metricsData.publicationId}
                })
            
            if (!found) {
                console.error("Invalid data Error:", "Publication isn't found in db");
                throw new Error("Error adding metrics: subCategory not found.");
            }
    
            const newPublicationMetrics = await db
                .publicationYearlyMetric
                .create({data:metricsData})
            return newPublicationMetrics
        } catch (error) {
            if (error) {
                console.error("publicationYearlyMetric DB Error:", error.message);
                throw new Error("error adding metrics.");
            }            
        }    
    },
    
    async getMetrics(metricsData:publicationMetricsID){
        try {
            const metrics = await db
                .publicationYearlyMetric
                .findUnique({
                    where:{id:metricsData.id},
                    include:{
                        publication:{
                            include:{
                                subCategory:{
                                    include:{
                                        domain:true
                                    }
                                }
                            }
                        }
                    }
                })
                console.log("publication metrics:", metrics);
                return metrics || {};
        } catch (error) {
            if (error) throw error;
        }
    },

    async patchMetrics( metricsData: publicationMetricsPatch ){
        try {
            if(metricsData.publicationId){
                const found = await db
                    .academicPublication
                    .findUnique({
                        where:{id:metricsData.publicationId}
                    })
                
                if (!found) {
                    console.error("Invalid data Error:", "Publication isn't found in db");
                    throw new Error("Error editing metric: Publication not found.");
                }
            }
            const patchedMetrics = await db
                .publicationYearlyMetric
                .update({
                    where:{id:metricsData.id},
                    data:metricsData
                })
            return patchedMetrics;
        } catch (error) {
            if (error) {
                console.error("publicationYearlyMetric DB Error:", error.message);
                throw new Error("error patching Publication metrics.");
            }            
        }    
    },
    
    async removeMetrics( metricsData: publicationMetricsID ){
        try {
            const removedMetrics = await db
                .publicationYearlyMetric
                .delete({
                    where:{id:metricsData.id}
                })
        } catch (error) {
            if (error) {
                console.error("publicationYearlyMetric DB Error:", error.message);
                throw new Error("error removing Publication Metric.");
            }
        }
    },

};

export default publicationService;