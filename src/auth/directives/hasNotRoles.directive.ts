import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core"
import { AuthService } from "../auth.service"
import { RoleContext, RoleDirective } from "./interfaces"
import { DomService } from "../dom/dom.service"

@Directive({ selector: '[secHasNotRoles]' })
export class HasNotRoles extends RoleDirective {

    @Input('secHasNotRoles')
    set hasAllRoles(roles: string | string[]) {
        this._context.$roles = roles
        this.applyDirective()
    }

    @Input('secHasNotRolesResource')
    set resource(resource: string) {
        this._context.$resource = resource
        this.applyDirective()
    }

    @Input('secHasNotRolesAction')
    set action(action: string) {
        this._context.$action = action
        this.applyDirective()
    }

    @Input('secHasNotRolesCssClass')
    set cssClass(cssClass: string) {
        this._context.$cssClass = cssClass
        this.applyDirective()
    }


    constructor(
        protected element: ViewContainerRef,
        protected domService: DomService,
        protected auth: AuthService,
        templateRef: TemplateRef<RoleContext>
    ) {
        super(element, domService, templateRef)
    }

    roleFunction = (roles: string[], resource?: string): boolean => {
        for (let role of roles) {
            if (this.auth.hasRole(role, resource)) {
                return false
            }
        }
        return true
    }
}
